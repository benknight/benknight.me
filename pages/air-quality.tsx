import dynamic from 'next/dynamic';
import Head from 'next/head';
import Colophon from '../components/Colophon';

const AirQualityDashboard = dynamic(() => import('../components/AirQualityDashboard'), {
  ssr: false,
  loading: () => (
    <div className="py-24 text-center text-black/50 dark:text-white/50">
      Loading dashboard&hellip;
    </div>
  ),
});

export default function AirQuality() {
  return (
    <>
      <Head>
        <title>Saigon Air Quality</title>
        <meta
          name="description"
          content="Historical air quality trends for Ho Chi Minh City: daily PM2.5, PM10, and US AQI since 2013."
        />
        <link rel="canonical" href="https://benknight.me/air-quality" />
      </Head>
      <Colophon />
      <main className="max-w-4xl mx-auto px-3 sm:px-6 py-8 sm:py-12">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
            Saigon Air Quality
          </h1>
          <p className="mt-3 text-sm sm:text-base text-black/50 dark:text-white/50 max-w-xl mx-auto">
            Historical air quality in Ho Chi Minh City — daily minimum, maximum, and
            average for PM2.5, PM10, and the US AQI, going back as far as the data allows.
          </p>
        </header>
        <AirQualityDashboard />
      </main>
    </>
  );
}
