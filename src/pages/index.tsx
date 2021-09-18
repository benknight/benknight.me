import Image from 'next/image';
import Link from 'next/link';
import Helmet from 'react-helmet';
import KnightIcon from '../../public/knight.svg';

export default function Index() {
  return (
    <>
      <Helmet>
        <title>benknight.me</title>
        <meta name="theme-color" content="#000" />
      </Helmet>
      <div className="fixed inset-0 flex flex-col items-center justify-center sm:font-light text-white antialiased text-opacity-40">
        <div className="absolute top-0 left-0 w-full h-full">
          <Image
            alt=""
            className="portrait:hidden filter brightness-110"
            layout="fill"
            objectFit="cover"
            quality={100}
            src="/portrait-landscape.jpg"
          />
          <Image
            alt=""
            className="landscape:hidden filter brightness-110"
            layout="fill"
            objectFit="cover"
            quality={100}
            sizes="100vh"
            src="/portrait-square.jpg"
          />
        </div>
        <ul className="relative uppercase text-sm leading-9 tracking-[0.5em] text-center">
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
          <li className="my-6">
            <a href="/resume" rel="author">
              Resume
            </a>
          </li>
          <li className="mt-12">
            <KnightIcon className="relative left-[-0.25rem] fill-current block w-4 h-4 mx-auto" />
          </li>
        </ul>
      </div>
    </>
  );
}
