import Image from 'next/image';
import Link from 'next/link';
import avatar from '../../public/portrait-avatar.jpg';

export default function Colophon() {
  return (
    <div className="w-full h-28 md:h-32 flex items-center justify-center bg-blue-100 dark:bg-black dark:bg-opacity-50 p-4">
      <Link href="/">
        <a
          className="block flex-shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 ml-3 md:ml-0"
          rel="author">
          <Image
            alt="Portrait of Benjamin Knight"
            className="rounded-full filter brightness-150"
            layout="fill"
            src={avatar}
          />
        </a>
      </Link>
      <p className="max-w-md ml-4 text-xs sm:text-sm md:text-base flex-grow-0">
        I’m{' '}
        <Link href="/">
          <a rel="author">
            <b>Benjamin Knight</b>
          </a>
        </Link>
        . I’m a coder and designer. I work on some of my own{' '}
        <Link href="/projects">
          <a rel="author">
            <b>projects</b>
          </a>
        </Link>{' '}
        and I’m available{' '}
        <Link href="/resume">
          <a rel="author">
            <b>for hire</b>
          </a>
        </Link>
        . Sometimes I{' '}
        <Link href="/location">
          <a rel="author">
            <b>travel</b>
          </a>
        </Link>
        .
      </p>
    </div>
  );
}
