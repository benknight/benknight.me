import Image from 'next/image';
import Link from 'next/link';
import Helmet from 'react-helmet';

const linkClassName = '';

export default function Index() {
  return (
    <>
      <Helmet>
        <title>benknight.me</title>
        <meta name="theme-color" content="#000" />
      </Helmet>
      <div className="fixed inset-0 flex flex-col items-center justify-center sm:font-light text-white antialiased text-opacity-30">
        <div className="absolute top-0 left-0 w-full h-full">
          <Image
            alt=""
            className="portrait:hidden"
            layout="fill"
            objectFit="cover"
            quality={100}
            src="/portrait-landscape.jpg"
          />
          <Image
            alt=""
            className="landscape:hidden"
            layout="fill"
            objectFit="cover"
            quality={100}
            sizes="100vh"
            src="/portrait-square.jpg"
          />
        </div>
        <ul
          className="relative uppercase leading-9 text-center"
          style={{ letterSpacing: '10px' }}>
          <li className="my-6">
            <Link href="/location">
              <a className={linkClassName} rel="author">
                Location
              </a>
            </Link>
          </li>
          <li className="my-6">
            <Link href="/posts">
              <a className={linkClassName} rel="author">
                Thoughts
              </a>
            </Link>
          </li>
          <li className="my-6">
            <Link href="/photos">
              <a className={linkClassName} rel="author">
                Photos
              </a>
            </Link>
          </li>
          <li className="my-6">
            <Link href="/projects">
              <a className={linkClassName} rel="author">
                Projects
              </a>
            </Link>
          </li>
          {/* <li className="my-6">
            <a
              href="https://toptal.com/resume/benjamin-knight"
              rel="author noopener noreferrer"
              target="_blank">
              CV
            </a>
          </li> */}
        </ul>
      </div>
    </>
  );
}