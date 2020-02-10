import { Link } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import portraitLandscape from '../../static/portrait-landscape.jpg';
import portraitSquare from '../../static/portrait-square.jpg';

export default function Index(props) {
  return (
    <>
      <Helmet>
        <title>benknight.me</title>
      </Helmet>
      <div className="relative w-screen h-screen flex flex-col items-center justify-center sm:font-thin text-gray-400">
        <picture className="absolute top-0 left-0 w-full h-full">
          <source media="(orientation: landscape)" srcSet={portraitLandscape} />
          <img
            alt=""
            className="block w-full h-full object-cover"
            src={portraitSquare}
            height="300"
          />
        </picture>
        <ul
          className="relative uppercase leading-10 text-center"
          style={{ letterSpacing: '10px' }}>
          <li className="my-6">
            <Link to="/posts" rel="author">
              Thoughts
            </Link>
          </li>
          <li className="my-6">
            <Link to="/location" rel="author">
              Location
            </Link>
          </li>
          <li className="my-6">
            <Link to="/photos" rel="author">
              Photos
            </Link>
          </li>
          <li className="my-6">
            <Link to="/projects" rel="author">
              Projects
            </Link>
          </li>
          <li className="my-6">
            <a
              href="https://toptal.com/resume/benjamin-knight"
              rel="author noopener noreferrer"
              target="_blank">
              CV
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
