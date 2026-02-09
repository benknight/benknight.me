import Image from 'next/image';
import Link from 'next/link';
import avatar from '../public/portrait-alt.jpg';

export default function Colophon() {
  return (
    <div className="lg:max-w-2xl flex items-center justify-center bg-stone-100 dark:bg-black dark:bg-opacity-50 p-4 mx-auto lg:my-4 lg:rounded-xl">
      <Link href="/">
        <a className="block shrink-0 relative w-16 h-16 sm:w-20 sm:h-20" rel="author">
          <Image
            alt="Portrait of Benjamin Knight"
            className="rounded-full"
            src={avatar}
            width={160}
            height={160}
          />
        </a>
      </Link>
      <p className="max-w-lg ml-6 text-xs sm:text-base md:text-lg grow-0 text-black/60 dark:text-white/60">
        I’m{' '}
        <Link href="/">
          <a rel="author" className="underline">
            <b>Ben Knight</b>
          </a>
        </Link>
        . I'm an independent{' '}
        <b>coder &amp; designer</b>
        . A&nbsp;native{' '}
        <Link href="/maine">
          <a ref="author" className="underline">
            <b>Mainer</b>
          </a>
        </Link>
        , I am currently living in Vietnam.
      </p>
    </div>
  );
}
