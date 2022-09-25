import { name } from 'country-emoji';
import moment from 'moment';
import { InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useCallback, useMemo } from 'react';
import Head from 'next/head';
import { Switch } from '@headlessui/react';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import Colophon from '../components/Colophon';

type Location = {
  Address: string,
  Date: string,
  Emoji: string,
  'Google Maps Link': string,
  Lat: number,
  Lng: number,
  'Photo Album Link'?: string,
};

export async function getStaticProps({ preview = false }) {
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
      preview,
    },
    revalidate: 1,
  };
}

function formatDate(...input: string[]) {
  const calendar = moment(input[0]).calendar(null, {
    // lastDay: '[Yesterday]',
    // lastWeek: '[Last] dddd',
    // sameDay: '[Today]',
    sameElse: function (now) {
      if (this.year() === moment(now).year()) {
        return 'MMMM D';
      }
      return 'LL';
    },
  });
  const days = Math.round(
    Math.max(1, moment(input[1]).diff(moment(input[0]), 'days', true)),
  );
  return (
    <>
      {days} {days > 1 ? 'days' : 'day'} <span className="opacity-50 mx-px">·</span>{' '}
      {calendar}
    </>
  );
}

export default function Location({
  locations,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  const onUpdateLocation = useCallback(() => {
    const onSuccess = async (position: GeolocationPosition) => {
      try {
        const secret = window.prompt('What’s the secret?');
        const params = new URLSearchParams({
          lat: String(position.coords.latitude),
          lng: String(position.coords.longitude),
          secret,
        });
        await fetch(`/api/update-location?${params.toString()}`);
        router.replace('/location');
      } catch (error) {
        window.alert('Failed to post location.');
        console.error(error);
      }
    };
    navigator.geolocation.getCurrentPosition(onSuccess);
  }, []);

  locations = useMemo(() => {
    locations = locations.sort(
      (a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime(),
    );
    if (router.query.view === 'country') {
      const groupedByCountry: Location[] = [];
      for (let i = 0; i < locations.length; i++) {
        if (locations[i + 1] && locations[i].Emoji === locations[i + 1].Emoji) {
          continue;
        } else {
          groupedByCountry.push({
            ...locations[i],
            Address: name(locations[i].Emoji),
          });
        }
      }
      locations = groupedByCountry;
    }
    return locations;
  }, [router.query.view]);

  return (
    <>
      <Head>
        <title>Location</title>
      </Head>
      {router.query.update && (
        <button className="p-4 w-full bg-green-500" onClick={onUpdateLocation}>
          Update location
        </button>
      )}
      <Colophon />
      <Switch.Group>
        <div className="pt-10 flex justify-center items-center text-sm  font-light">
          <Switch.Label className="cursor-pointer w-20 text-right">cities</Switch.Label>
          <Switch
            checked={router.query.view === 'country'}
            onChange={() =>
              router.replace(
                `/location?view=${router.query.view === 'country' ? 'city' : 'country'}`,
              )
            }
            className="bg-stone-300 dark:bg-stone-500 relative inline-flex shrink-0 h-5 w-10 mx-3 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className={`${
                router.query.view === 'country' ? 'translate-x-5' : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 rounded-full shadow-lg ring-0 transition ease-in-out duration-200`}
              style={{ backgroundColor: 'ButtonFace' }}
            />
          </Switch>
          <Switch.Label className="cursor-pointer w-20">countries</Switch.Label>
        </div>
      </Switch.Group>
      <ul id="root" className="px-8 lg:px-16 pb-16 m-auto text-center">
        {locations.map((location, index) => {
          const prev = locations[index - 1];
          return (
            <li className="mt-16" key={location.Date}>
              <div className="inline-block">
                <a
                  className={`mb-4 text-3xl leading-[4.1rem] text-center inline-flex`}
                  href={location['Google Maps Link']}
                  target="_blank"
                  rel="noreferrer">
                  {index === 0 && (
                    <>
                      <div className="absolute w-16 h-16 bg-blue-500 ring ring-blue-500 rounded-full" />
                      <div className="absolute w-16 h-16 animate-ping bg-blue-500/50 rounded-full" />
                    </>
                  )}
                  <div className="relative bg-stone-100/90 dark:bg-black/80 inline-block w-16 h-16 rounded-full">
                    {location.Emoji}
                  </div>
                </a>
                <br />
                <a
                  className="font-bold"
                  href={location['Google Maps Link']}
                  target="_blank"
                  rel="noreferrer">
                  {location.Address}
                </a>
                <br />
                <time dateTime={location.Date}>
                  {formatDate(location.Date, prev && prev.Date)}
                </time>
                {location['Photo Album Link'] && (
                  <>
                    {' '}
                    &middot;{' '}
                    <a href={location['Photo Album Link']} target="_blank">
                      <PhotoLibraryIcon className="w-4 h-4" />
                      <span className="sr-only">Photo Album</span>
                    </a>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
