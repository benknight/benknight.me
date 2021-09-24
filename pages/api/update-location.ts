import AirtableClient from 'airtable';
import { flag } from 'country-emoji';
import type { NextApiRequest, NextApiResponse } from 'next';
import maps from '@google/maps';

const airtableKey = process.env.AIRTABLE_KEY;
const googleKey = process.env.GOOGLE_KEY;
const base = new AirtableClient({ apiKey: airtableKey }).base('app42Tz6LNdfUEXBP');
const mapsClient = maps.createClient({ key: googleKey, Promise });

export default async function preview(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { lat, lng, secret } = request.query;

  if (!process.env.PREVIEW_SECRET || secret !== process.env.PREVIEW_SECRET) {
    return response.status(401).json({ message: 'Invalid request' });
  }

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
    const formatted_address = (locality || adminAreaL1).formatted_address;
    const emoji = country && flag(country.formatted_address);
    const records = await base('Location').create([
      {
        fields: {
          Date: new Date().toISOString(),
          Lat: Number(lat),
          Lng: Number(lng),
          Address: formatted_address,
          Emoji: emoji,
        },
      },
    ]);
    response.json(records.map(r => r.fields));
  } catch (error) {
    console.error(error);
    response.status(500).send('Error');
  }
}
