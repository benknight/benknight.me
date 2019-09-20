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

const spreadsheetID = '1oezVj5O97Ao0g52UvCruCQOSd4Js0MnB1_tuo5mP8I0';
const key = 'AIzaSyAGLqTBLbyJvKOMEWRaMKTKrbV5hCuMTuQ';
const sheetURL =
  'https://sheets.googleapis.com/v4/spreadsheets/' +
  `${spreadsheetID}/values/Sheet1!A1:D99?key=${key}`;
const IFTTTTimeFormat = 'MMMM D, YYYY at hh:mmA';

function formatShittyDate(row) {
  const timezone = tzlookup(row[1], row[2]);
  const m = moment.tz(row[0], IFTTTTimeFormat, timezone);
  return m.calendar(null, { sameElse: 'MMMM D, YYYY' });
}

function getGMapsLink(lat, lng) {
  return `https://maps.google.com/maps?q=${lat},${lng}`;
}

axios.get(sheetURL).then(response => {
  const rows = response.data.values.reverse().filter(row => !!row[3]);
  const currentRow = rows[0];
  const lat = currentRow[1];
  const lng = currentRow[2];
  const imgParams = new URLSearchParams({
    markers: `color:red|size:mid|scale:2|${lat},${lng}`,
    key,
    scale: 2,
    size: '640x427',
    zoom: 6,
  });
  staticMapsStyle.forEach(style => imgParams.append('style', style));

  document.getElementById('root').innerHTML = `
    <h1 class="f2 f1-m f-subheadline-l lh-title mv4 mv5-l ph3 ph5-l">${currentRow[3]}</h1>
    <a href="${getGMapsLink(lat, lng)}">
      <img
        class="h-auto"
        src="http://maps.google.com/maps/api/staticmap?${imgParams.toString()}"
        width="640"
        height="427">
    </a>
    <ul class="list ph4 ph6-l mv4 mv5-l tl lh-copy mw8">
      ${rows
        .map(
          row =>
            `<li class="mt4 f3-l">
              <a class="link color-inherit" href="${getGMapsLink(row[1], row[2])}">
                <b class="near-white">${row[3]}</b><br />
                ${formatShittyDate(row)}
              </a>
            </li>`,
        )
        .join('')}
    </ul>
  `;
});
