import moment from 'moment';
import { InferGetStaticPropsType } from 'next';
import Colophon from '../components/Colophon';

type Location = {
  Address: string,
  Date: string,
  Emoji: string,
  'Google Maps Link': string,
  Lat: number,
  Lng: number,
};

export async function getStaticProps() {
  let offset = '';
  let locations: Location[] = [];
  do {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Location?view=Grid&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      },
    );
    const data = await response.json();
    locations = locations.concat(data.records.map(record => record.fields));
    offset = data.offset;
  } while (Boolean(offset));
  return {
    props: {
      locations,
    },
    revalidate: 1,
  };
}

function formatDate(...input: string[]) {
  const calendar = moment(input[0]).calendar(null, {
    // lastDay: '[Yesterday]',
    // lastWeek: '[Last] dddd',
    // sameDay: '[Today]',
    sameElse: function(now) {
      if (this.year() === moment(now).year()) {
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

export default function Location({
  locations,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Colophon />
      <ul id="root" className="px-8 px16-l pb-16 m-auto text-center">
        {locations
          .sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime())
          .map((location, index) => {
            const prev = locations[index - 1];
            return (
              <li className="mt-16" key={location.Date}>
                <a className="inline-block" href={location['Google Maps Link']}>
                  <span className="emoji bg-gray-200 dark:bg-black inline-block w-16 h-16 mb-4 text-3xl leading-[4.1rem] text-center rounded-full">
                    {location.Emoji}
                  </span>
                  <br />
                  <b>{location.Address}</b>
                  <br />
                  <time dateTime={location.Date}>
                    {formatDate(location.Date, prev && prev.Date)}
                  </time>
                </a>
              </li>
            );
          })}
      </ul>
    </>
  );
}
