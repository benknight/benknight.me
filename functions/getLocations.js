const airtable = require('airtable');
const { https, config } = require('firebase-functions');
const moment = require('moment');

const airtableKey = config().airtable.api_key;
const base = new airtable({ apiKey: airtableKey }).base('app42Tz6LNdfUEXBP');

function formatDate(...input) {
  const calendar = moment(input[0]).calendar(null, {
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
  return `${calendar} · ${days} ${days > 1 ? 'days' : 'day'}`;
}

module.exports = https.onRequest(async (request, response) => {
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
  </head>
  <body class="ma0 pa0 tc">
    <ul id="root" class="list ph4 ph5-l pb5 ma0 tc lh-copy mw8 center">
      ${records
        .map(
          (r, index) => `
      <li class="mt5">
        <a class="dib link color-inherit" href="${r['Google Maps Link']}">
          <span class="emoji">${r.Emoji}</span><br />
          <b class="near-white">${r.Address}</b><br />
          ${formatDate(r.Date, (records[index - 1] || {}).Date)}
        </a>
      </li>`,
        )
        .join('')}
    </ul>
  </body>
</html>
    `);
  } catch (error) {
    console.log(error);
    response.status(500).send('Error');
  }
});
