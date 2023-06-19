import Script from 'next/script';
import '../style.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        data-goatcounter="https://benknight.goatcounter.com/count"
        async
        src="//gc.zgo.at/count.js"
      />
      <Component {...pageProps} />
    </>
  );
}
