import Head from 'next/head';
import Colophon from '../components/Colophon';

export default function Photos() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <Head>
        <title>Photos</title>
        <link rel="canonical" href="https://www.benknight.me/photos" />
      </Head>
      <Colophon />
      <div className="relative w-full flex-auto p-4 flex items-center justify-center">
        <svg
          className="animate-spin mr-[0.5rem] mt-[2px] h-[1rem] w-[1rem] dark:text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading albums&hellip;
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          height="100%"
          src="https://airtable.com/embed/shrDFa0a0ErGTsqAr?backgroundColor=gray"
          title="Photo albums"
          width="100%"></iframe>
      </div>
    </div>
  );
}
