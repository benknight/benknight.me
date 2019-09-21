// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
// const functions = require('firebase-functions');
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   response.send('Hello from Firebase!');
// });
const Airtable = require('airtable');
const functions = require('firebase-functions');

const apiKey = functions.config().airtable.api_key;
const base = new Airtable({ apiKey }).base('app42Tz6LNdfUEXBP');

exports.getLocations = functions.https.onRequest((request, response) => {
  base('Location')
    .select()
    .firstPage((error, records) => {
      if (error) {
        console.error(error);
        response.status(500).end();
      }
      response.json(records.map(r => r.fields)).send();
    });
});

exports.postLocation = functions.https.onRequest((request, response) => {
  // TODO
});
