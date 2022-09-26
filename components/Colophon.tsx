import Image from 'next/image';
import Link from 'next/link';
import avatar from '../public/portrait-alt.jpg';

export default function Colophon() {
  return (
    <div className="w-full h-28 md:h-32 flex items-center justify-center bg-stone-100 dark:bg-black dark:bg-opacity-50 p-4">
      <Link href="/">
        <a
          className="block shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 ml-3 md:ml-0"
          rel="author">
          <Image
            alt="Portrait of Benjamin Knight"
            className="rounded-full object-top"
            objectFit="cover"
            placeholder="blur"
            src={avatar}
            width={160}
            height={160}
          />
        </a>
      </Link>
      <p className="max-w-md ml-6 text-xs sm:text-sm md:text-base grow-0 text-black/60 dark:text-white/60">
        I’m{' '}
        <Link href="/">
          <a rel="author" className="underline">
            <b>Benjamin Knight</b>
          </a>
        </Link>
        . I’m a coder and designer. I work on some of my own{' '}
        <Link href="/projects">
          <a rel="author" className="underline">
            <b>projects</b>
          </a>
        </Link>{' '}
        and I’m available{' '}
        <Link href="/resume">
          <a rel="author" className="underline">
            <b>for hire</b>
          </a>
        </Link>
        . Sometimes I{' '}
        <Link href="/location">
          <a rel="author" className="underline">
            <b>travel</b>
          </a>
        </Link>
        .
      </p>
    </div>
  );
}
