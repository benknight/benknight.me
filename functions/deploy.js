const axios = require('axios');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

const githubToken = functions.config().github.token;
const deploySecret = functions.config().deploy.secret;

exports.deploy = functions.https.onRequest(async (req, res) => {
  if (req.query.secret !== deploySecret) {
    res.status(403).send('Unauthorized');
    return;
  }
  try {
    await axios.post(
      'https://api.github.com/repos/benknight/benknight.me/dispatches',
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
    res.status(200).send('Success');
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send('Error');
    return;
  }
});
