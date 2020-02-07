const axios = require('axios');
const { https, config } = require('firebase-functions');
const moment = require('moment');

const lifxToken = config().lifx.token;

exports.prettyLights = https.onRequest(async (request, response) => {
  const colors = [
    'hue:0 saturation:1.0 brightness:0.5', // red
    'hue:35 saturation:1.0 brightness:0.5', // orange
    'hue:55 saturation:1.0 brightness:0.5', // yellow
    'hue:90 saturation:1.0 brightness:0.5', // green
    'hue:165 saturation:1.0 brightness:0.5', // sky blue
    'hue:225 saturation:1.0 brightness:0.5', // indigo
    'hue:325 saturation:1.0 brightness:0.5', // hotpink
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  try {
    await axios.put(
      'https://api.lifx.com/v1/lights/states',
      {
        states: [
          {
            selector: 'd073d514ccfb', // strip
            power: 'on',
            color: colors[randomIndex],
          },
          {
            selector: 'd073d5235663', // table
            power: 'on',
            color: colors[(randomIndex + 1) % colors.length],
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
