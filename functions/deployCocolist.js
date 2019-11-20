const axios = require('axios');
const { https, config } = require('firebase-functions');

const githubToken = config().github.cocolist_token;

module.exports = https.onRequest(async (request, response) => {
  try {
    await axios.post(
      'https://api.github.com/repos/benknight/cocolist/dispatches',
      {
        event_type: 'deploy',
      },
      {
        auth: {
          username: 'benknight',
          password: githubToken,
        },
        headers: { Accept: 'application/vnd.github.everest-preview+json' },
      },
    );
    response.status(200).send('Success');
  } catch (error) {
    console.error(error);
    response.status(500).send('Error');
  }
});
