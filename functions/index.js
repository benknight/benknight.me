// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/Functions/write-firebase-Functions
// const admin = require('firebase-admin');
// const Functions = require('firebase-functions');
//
// admin.initializeApp();
//
// exports.helloWorld = Functions.https.onRequest((request, response) => {
//   response.send('Hello from Firebase!');
// });

const Airtable = require('airtable');
const Functions = require('firebase-functions');
const GoogleMaps = require('@google/maps');

const airtableKey = Functions.config().airtable.api_key;
const googleKey = Functions.config().google.server_key;
const base = new Airtable({ apiKey: airtableKey }).base('app42Tz6LNdfUEXBP');
const mapsClient = GoogleMaps.createClient({ key: googleKey, Promise });

exports.getLocations = Functions.https.onRequest(async (request, response) => {
  try {
    const records = await base('Location')
      .select({ sort: [{ field: 'Date', direction: 'desc' }] })
      .firstPage();
    response.json(records.map(r => r.fields)).send();
  } catch (error) {
    console.log(error);
    response.status(500).send();
  }
});

exports.postLocation = Functions.https.onRequest(async (request, response) => {
  const { lat, lng } = request.body;
  if (!lat || !lng) {
    response.status(400).end();
    return;
  }
  try {
    const {
      json: { results },
    } = await mapsClient
      .reverseGeocode({
        latlng: [lat, lng],
        result_type: 'locality|administrative_area_level_1',
      })
      .asPromise();
    const locality = results.find(r => r.types.indexOf('locality') !== -1);
    const adminAreaL1 = results.find(
      r => r.types.indexOf('administrative_area_level_1') !== -1,
    );
    const records = await base('Location').create([
      {
        fields: {
          Date: new Date().toISOString(),
          Lat: lat,
          Lng: lng,
          Address: (locality || adminAreaL1).formatted_address,
        },
      },
    ]);
    return response.json(records.map(r => r.fields)).send();
  } catch (error) {
    console.error(error);
    return response.status(500).end();
  }
});
