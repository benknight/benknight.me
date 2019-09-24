const mapBoxToken =
  'pk.eyJ1IjoiYmVua25pZ2h0IiwiYSI6ImNrMHVnbGFyeTBoM3UzY21pcWJid3ZlYzYifQ.-Mv5-BnFs38Zy2RAsvGkcQ';

function formatDate(input) {
  const date = moment(input);
  return moment(input).calendar(null, {
    sameElse: function(now) {
      const fromNow = this.fromNow();
      if (this.year() === now.year()) {
        return `MMMM D · [${fromNow}]`;
      }
      return `LL · [${fromNow}]`;
    },
  });
}

axios.get('/getLocations').then(response => {
  const records = response.data;
  const current = records[0];
  const mapSm = `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/pin-l+000(${current.Lng},${current.Lat})/${current.Lng},${current.Lat},5,0,0/425x300@2x?access_token=${mapBoxToken}`;
  const mapLg = `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/pin-l+000(${current.Lng},${current.Lat})/${current.Lng},${current.Lat},5,0,0/640x480@2x?access_token=${mapBoxToken}`;

  document.getElementById('root').innerHTML = `
    <div class="flex flex-column">
      <a class="order-1-ns mv4-ns" href="${current['Google Maps Link']}">
        <picture>
          <source media="(min-width: 425px)" srcset="${mapLg}">
          <img alt="" class="h-auto" height="480" src="${mapSm}" width="640">
        </picture>
      </a>
      <h1 class="f2 f1-m f-subheadline-l lh-title mv4 mv5-l ph4 ph5-l mw8 center">
        ${current.Emoji}<br />
        ${current.Address}
      </h1>
    </div>
    <ul class="list ph4 ph5-l mv4 mv5-l tl lh-copy mw8 center">
      ${records
        .map(
          r =>
            `<li class="mt4 mt5-l f3-ns tc-ns">
              <a class="dib link color-inherit" href="${r['Google Maps Link']}">
                <span class="emoji f3-m f2-l">${r.Emoji}</span><br />
                <b class="near-white">${r.Address}</b><br />
                ${formatDate(r.Date)}
              </a>
            </li>`,
        )
        .join('')}
    </ul>
  `;
});
