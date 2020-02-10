const airtable = require('airtable');
const { flag } = require('country-emoji');
const { https, config } = require('firebase-functions');
const maps = require('@google/maps');

const airtableKey = config().airtable.api_key;
const googleKey = config().google.server_key;
const iftttKey = config().ifttt.maker_key;
const base = new airtable({ apiKey: airtableKey }).base('app42Tz6LNdfUEXBP');
const mapsClient = maps.createClient({ key: googleKey, Promise });

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
    response.json(records.map(r => r.fields)).send();
  } catch (error) {
    console.error(error);
    response.status(500).send('Error');
  }
});
