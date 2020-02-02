const airtable = require('airtable');
const axios = require('axios');
const { flag } = require('country-emoji');
const { https, config } = require('firebase-functions');
const maps = require('@google/maps');

const airtableKey = config().airtable.api_key;
const googleKey = config().google.server_key;
const iftttKey = config().ifttt.maker_key;
const base = new airtable({ apiKey: airtableKey }).base('app42Tz6LNdfUEXBP');
const mapsClient = maps.createClient({ key: googleKey, Promise });

exports.getLocations = https.onRequest(async (request, response) => {
  try {
    const result = await base('Location')
      .select({ sort: [{ field: 'Date', direction: 'desc' }] })
      .firstPage();
    const records = result.map(r => r.fields);
    response.status(200).send(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta content="width=device-width" name="viewport" />
    <title>Location</title>
    <link href="/node_modules/tachyons/css/tachyons.min.css?v=4.11.1" rel="stylesheet">
    <link href="/dark-theme.css" rel="stylesheet" />
    <style>
      html {
        font-size: 18px;
      }

      @media screen and (min-width: 30em) {
        html {
          font-size: 22px;
        }
      }

      .emoji {
        display: inline-block;
        width: 4rem;
        height: 4rem;
        margin-bottom: 1rem;
        line-height: 4.2rem;
        font-size: 2rem;
        text-align: center;
        background: var(--near-black);
        border-radius: 50%;
      }

      li:first-child .emoji {
        box-shadow: inset 0 0 0 2px hsl(200, 100%, 50%);
      }
    </style>
    <script src="/node_modules/moment/min/moment.min.js?v=2.24.0"></script>
  </head>
  <body class="ma0 pa0 tc">
    <ul id="root" class="list ph4 ph5-l pb5 ma0 tc lh-copy mw8 center">
      ${records
        .map(
          r => `
      <li class="mt5">
        <a class="dib link color-inherit" href="${r['Google Maps Link']}">
          <span class="emoji">${r.Emoji}</span><br />
          <b class="near-white">${r.Address}</b><br />
          <time datetime="${r.Date}" />
        </a>
      </li>`,
        )
        .join('')}
    </ul>
    <script>
      function formatDate(...input) {
        const calendar = moment(input[0]).calendar(null, {
          // lastDay: '[Yesterday]',
          // lastWeek: '[Last] dddd',
          // sameDay: '[Today]',
          sameElse: function(now) {
            if (this.year() === now.year()) {
              return 'MMMM D';
            }
            return 'LL';
          },
        });
        const days = Math.round(
          Math.max(1, moment(input[1]).diff(moment(input[0]), 'days', true)),
        );
        return \`\${calendar} · \${days} \${days > 1 ? 'days' : 'day'}\`;
      }

      document.addEventListener('DOMContentLoaded', () => {
        const timeElements = document.body.querySelectorAll('time');
        timeElements.forEach((node, index) => {
          let prevDateTime;
          const prevNode = timeElements[index - 1];
          if (prevNode) {
            prevDateTime = prevNode.getAttribute('datetime');
          }
          node.textContent = formatDate(node.getAttribute('datetime'), prevDateTime);
        });
      });
    </script>
  </body>
</html>
    `);
  } catch (error) {
    console.log(error);
    response.status(500).send('Error');
  }
});

exports.postLocation = https.onRequest(async (request, response) => {
  const { lat, lng } = request.body;
  if (!lat || !lng) {
    response.status(400).send('Invalid LatLng data');
    return;
  }
  try {
    const {
      json: { results },
    } = await mapsClient
      .reverseGeocode({
        latlng: [lat, lng],
        result_type: 'country|locality|administrative_area_level_1',
      })
      .asPromise();
    const locality = results.find(r => r.types.indexOf('locality') !== -1);
    const adminAreaL1 = results.find(
      r => r.types.indexOf('administrative_area_level_1') !== -1,
    );
    const country = results.find(r => r.types.indexOf('country') !== -1);
    const address = (locality || adminAreaL1).formatted_address;
    const formatted_address = (locality || adminAreaL1).formatted_address;
    const emoji = country && flag(country.formatted_address);
    const records = await base('Location').create([
      {
        fields: {
          Date: new Date().toISOString(),
          Lat: lat,
          Lng: lng,
          Address: formatted_address,
          Emoji: emoji,
        },
      },
    ]);
    await axios.post(
      `https://maker.ifttt.com/trigger/new_location/with/key/${iftttKey}`,
      { value1: `${formatted_address} ${emoji}` },
    );
    response.json(records.map(r => r.fields)).send();
  } catch (error) {
    console.error(error);
    response.status(500).send('Error');
  }
});
