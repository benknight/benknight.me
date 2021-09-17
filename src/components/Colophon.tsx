import Image from 'next/image';
import Link from 'next/link';

export default function Colophon() {
  return (
    <div className="w-full h-32 flex items-center justify-center bg-blue-100 dark:bg-black p-4">
      <Link href="/">
        <a
          className="block flex-shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
          rel="author">
          <Image
            alt="Portrait of Benjamin Knight"
            className="rounded-full"
            layout="fill"
            src="/portrait-avatar.jpg"
          />
        </a>
      </Link>
      <p className="max-w-lg ml-4 text-xs sm:text-sm md:text-base">
        I’m{' '}
        <Link href="/">
          <a className="font-bold no-underline link" rel="author">
            Benjamin Knight
          </a>
        </Link>
        . I’m a coder and designer. I work on some of my own{' '}
        <Link href="/projects">
          <a className="font-bold no-underline link" rel="author">
            projects
          </a>
        </Link>{' '}
        and I’m available for hire. Sometimes I{' '}
        <Link href="/location">
          <a className="font-bold no-underline link" rel="author">
            travel
          </a>
        </Link>
        .
      </p>
    </div>
  );
}
