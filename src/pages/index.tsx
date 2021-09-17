import Image from 'next/image';
import Link from 'next/link';
import Helmet from 'react-helmet';

export default function Index() {
  return (
    <>
      <Helmet>
        <title>benknight.me</title>
      </Helmet>
      <div className="relative w-screen h-screen flex flex-col items-center justify-center sm:font-light text-gray-400">
        <div className="absolute top-0 left-0 w-full h-full">
          <Image
            alt=""
            className="portrait:hidden"
            layout="fill"
            objectFit="cover"
            src="/portrait-landscape.jpg"
          />
          <Image
            alt=""
            className="landscape:hidden"
            layout="fill"
            objectFit="cover"
            src="/portrait-square.jpg"
          />
        </div>
        <ul
          className="relative uppercase leading-10 text-center"
          style={{ letterSpacing: '10px' }}>
          <li className="my-6">
            <Link href="/location">
              <a rel="author">Location</a>
            </Link>
          </li>
          <li className="my-6">
            <Link href="/posts">
              <a rel="author">Thoughts</a>
            </Link>
          </li>
          <li className="my-6">
            <Link href="/photos">
              <a rel="author">Photos</a>
            </Link>
          </li>
          <li className="my-6">
            <Link href="/projects">
              <a rel="author">Projects</a>
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
