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
    <link href="/style.css" rel="stylesheet" />
    <style>
      .emoji {
        line-height: 4.1rem;
      }

      li:first-child .emoji {
        box-shadow: inset 0 0 0 2px hsl(200, 100%, 50%);
      }
    </style>
    <script src="/node_modules/moment/min/moment.min.js?v=2.24.0"></script>
  </head>
  <body class="text-center">
    <iframe class="w-full h-32" src="/colophon.html"></iframe>
    <ul id="root" class="px-8 px16-l pb-16 m-0 m-auto">
      ${records
        .map(
          r => `
      <li class="mt-16">
        <a class="inline-block" href="${r['Google Maps Link']}">
          <span class="emoji bg-gray-200 dark:bg-black inline-block w-16 h-16 mb-4 text-3xl text-center rounded-full">
            ${r.Emoji}
          </span>
          <br />
          <b>${r.Address}</b>
          <br />
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
    <script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-analytics.js"></script>
    <script>
      var firebaseConfig = {
        apiKey: "AIzaSyCR-DbShxSqAe9gAVEwoZxpbbs8ofEwFxo",
        authDomain: "benknight-website.firebaseapp.com",
        databaseURL: "https://benknight-website.firebaseio.com",
        projectId: "benknight-website",
        storageBucket: "benknight-website.appspot.com",
        messagingSenderId: "46618137938",
        appId: "1:46618137938:web:80bebcd66c8ed7aa04d68b",
        measurementId: "G-3436TME345"
      };
      firebase.initializeApp(firebaseConfig);
      firebase.analytics();
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
