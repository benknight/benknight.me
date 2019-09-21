const staticMapsStyle = [
  'element:geometry|color:0x212121',
  'element:labels.icon|visibility:off',
  'element:labels.text.fill|color:0x757575',
  'element:labels.text.stroke|color:0x212121',
  'feature:administrative|element:geometry|color:0x757575',
  'feature:administrative.country|element:labels.text.fill|color:0x9e9e9e',
  'feature:administrative.land_parcel|visibility:off',
  'feature:administrative.locality|element:labels.text.fill|color:0xbdbdbd',
  'feature:poi|element:labels.text.fill|color:0x757575',
  'feature:poi.park|element:geometry|color:0x181818',
  'feature:poi.park|element:labels.text.fill|color:0x616161',
  'feature:poi.park|element:labels.text.stroke|color:0x1b1b1b',
  'feature:road|element:geometry.fill|color:0x2c2c2c',
  'feature:road|element:labels.text.fill|color:0x8a8a8a',
  'feature:road.arterial|element:geometry|color:0x373737',
  'feature:road.highway|element:geometry|color:0x3c3c3c',
  'feature:road.highway.controlled_access|element:geometry|color:0x4e4e4e',
  'feature:road.local|element:labels.text.fill|color:0x616161',
  'feature:transit|element:labels.text.fill|color:0x757575',
  'feature:water|element:geometry|color:0x000000',
  'feature:water|element:labels.text.fill|color:0x3d3d3d',
];

axios.get('/getLocations').then(response => {
  const records = response.data;
  const current = records[0];
  const imgParams = new URLSearchParams({
    markers: `color:red|size:mid|scale:2|${current.Lat},${current.Lng}`,
    key: 'AIzaSyDq5zfLEium8NQpQS7XElO2RjxvvMmkJks',
    scale: 2,
    size: '640x480',
    zoom: 6,
  });
  staticMapsStyle.forEach(style => imgParams.append('style', style));
  const staticMapImage = `https://maps.google.com/maps/api/staticmap?${imgParams.toString()}`;

  document.getElementById('root').innerHTML = `
    <div class="flex flex-column">
      <a class="order-1-ns mv4-ns" href="${current['Google Maps Link']}">
        <img
          class="h-auto"
          src="${staticMapImage}"
          width="640"
          height="480">
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
            `<li class="mt4 f3-l">
              <a class="link color-inherit" href="${r['Google Maps Link']}">
                <span>${r.Emoji} </span>
                <b class="near-white">${r.Address}</b><br />
                ${moment(r.Date).calendar(null, { sameElse: 'MMMM D, YYYY' })}
              </a>
            </li>`,
        )
        .join('')}
    </ul>
  `;
});
