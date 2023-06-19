import Image from 'next/image';
import Link from 'next/link';
import avatar from '../public/portrait-alt.jpg';

export default function Colophon() {
  return (
    <div className="w-full h-28 md:h-32 flex items-center justify-center bg-stone-100 dark:bg-black dark:bg-opacity-50 p-4">
      <Link href="/">
        <a
          className="block shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 ml-1 md:ml-0"
          rel="author">
          <Image
            alt="Portrait of Benjamin Knight"
            className="rounded-full"
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
        . I’m an independent{' '}
        <Link href="/projects">
          <a rel="author" className="underline">
            <b>coder &amp; designer</b>
          </a>
        </Link>
        . A&nbsp;native Mainer, I am{' '}
        <Link href="/location">
          <a rel="author" className="underline">
            <b>currently</b>
          </a>
        </Link>{' '}
        living in Vietnam. I like to listen to{' '}
        <Link href="/favorite-albums">
          <a rel="author" className="underline">
            <b>music</b>
          </a>
        </Link>
        ,{' '}
        <Link href="/reading">
          <a rel="author" className="underline">
            <b>read</b>
          </a>
        </Link>
        , and get some{' '}
        <Link href="https://www.strava.com/athletes/benknight">
          <a rel="author" className="underline">
            <b>exercise</b>
          </a>
        </Link>
        .
      </p>
    </div>
  );
}
