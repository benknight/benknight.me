const airtable = require('airtable');
const { https, config } = require('firebase-functions');

const airtableKey = config().airtable.api_key;
const base = new airtable({ apiKey: airtableKey }).base('app42Tz6LNdfUEXBP');

module.exports = https.onRequest(async (request, response) => {
  try {
    const records = await base('Location')
      .select({ sort: [{ field: 'Date', direction: 'desc' }] })
      .firstPage();
    response.json(records.map(r => r.fields)).send();
  } catch (error) {
    console.log(error);
    response.status(500).send('Error');
  }
});
