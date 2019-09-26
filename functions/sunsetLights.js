const axios = require('axios');
const { https, config } = require('firebase-functions');
const moment = require('moment');

const lifxToken = config().lifx.token;

module.exports = https.onRequest(async (request, response) => {
  const { sunset } = request.body;
  if (!sunset) {
    response.status(400).send('Sunset parameter missing');
    return;
  }
  const dayOfWeek = moment(sunset, 'MMMM D, YYYY').day();
  const colors = [
    'hue:0 saturation:1.0 brightness:0.5', // red
    'hue:35 saturation:1.0 brightness:0.5', // orange
    'hue:55 saturation:1.0 brightness:0.5', // yellow
    'hue:90 saturation:1.0 brightness:0.5', // green
    'hue:165 saturation:1.0 brightness:0.5', // sky blue
    'hue:225 saturation:1.0 brightness:0.5', // indigo
    'hue:325 saturation:1.0 brightness:0.5', // hotpink
  ];
  try {
    await axios.put(
      'https://api.lifx.com/v1/lights/states',
      {
        states: [
          {
            selector: 'd073d514ccfb', // strip
            color: colors[dayOfWeek],
          },
          {
            selector: 'd073d5235663', // table
            color: colors[(dayOfWeek + 1) % 7],
          },
        ],
      },
      {
        headers: { Authorization: `Bearer ${lifxToken}` },
      },
    );
    response.status(200).send('Success');
  } catch (error) {
    console.error(error);
    response.status(500).send('Error');
  }
});
