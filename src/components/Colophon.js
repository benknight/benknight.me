import { Link } from 'gatsby';
import React from 'react';
import avatar from '../../static/portrait-avatar.jpg';

export default function Colophon() {
  return (
    <div className="w-full h-32 flex items-center justify-center bg-blue-100 dark:bg-black p-4">
      <Link className="block flex-shrink-0" to="/" rel="author">
        <img
          alt="Portrait of Benjamin Knight"
          className="rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
          src={avatar}
        />
      </Link>
      <p className="max-w-lg ml-4 text-xs sm:text-sm md:text-base">
        I’m{' '}
        <Link className="font-bold" to="/" rel="author">
          Benjamin Knight
        </Link>
        . I’m a coder and designer living in vibrant Saigon, Vietnam. I work on some of my
        own{' '}
        <Link className="font-bold" to="/projects" rel="author">
          projects
        </Link>{' '}
        and I’m available{' '}
        <a className="font-bold" href="https://toptal.com/resume/benjamin-knight">
          for hire
        </a>
        . Sometimes I{' '}
        <Link className="font-bold" to="/location" rel="author">
          travel
        </Link>
        .
      </p>
    </div>
  );
}
