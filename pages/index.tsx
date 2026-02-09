import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import KnightIcon from '../public/knight.svg';
import portraitLandscape from '../public/portrait-landscape.jpg';
import portraitSquare from '../public/portrait-square.jpg';

type Link = {
  href: string;
  text: string;
};

const links: Link[] = [
  { text: 'Posts', href: '/posts' },
  { text: 'Projects', href: '/projects' },
];

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>benknight.me</title>
        <meta name="theme-color" content="#000" />
        <link rel="canonical" href="https://benknight.me/" />
      </Head>
      <div className="fixed inset-0 flex flex-col items-center justify-center font-medium landscape:font-light text-white antialiased text-opacity-40">
        <div className="absolute top-0 left-0 w-full h-full">
          <Image
            alt=""
            className="portrait:hidden filter brightness-110"
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            quality={90}
            src={portraitLandscape}
          />
          <Image
            alt=""
            className="landscape:hidden filter brightness-110"
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            quality={90}
            sizes="100vh"
            src={portraitSquare}
          />
        </div>
        <ul className="relative uppercase text-sm leading-9 tracking-[0.5em] text-center">
          {links.map(link => (
            <li className="mb-3" key={link.href}>
              <Link href={link.href}>
                <a
                  className="block hover:text-white hover:text-opacity-60 ease p-2"
                  rel="author">
                  {link.text}
                </a>
              </Link>
            </li>
          ))}
          <li className="mt-8" title="It’s a knight, get it?">
            <KnightIcon className="relative left-[-0.25rem] fill-current block w-4 h-4 mx-auto hover:text-white hover:text-opacity-60 transition-colors duration-500 ease" />
          </li>
        </ul>
      </div>
    </>
  );
}
