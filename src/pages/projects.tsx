import Colophon from '../components/Colophon';

export default function Projects() {
  return (
    <>
      <Colophon />
      <div className="typography p-8 lg:px-16 max-w-2xl m-auto">
        <h1>Projects</h1>
        <ul>
          <li>
            <a href="https://vietnamcoracle.com">Vietnam Coracle</a> <em>2020-present</em>
            <p>
              I manage all technology for this popular blog for independent travel in
              Vietnam. In 2021 I completely redesigned and rebuilt the site with Next.JS
              and WordPress as a headless CMS.
            </p>
          </li>
          <li>
            <a href="https://cocolist.app">Cocolist</a> <em>2019</em>
            <p>
              Web app for finding eco-friendly businesses. Made with Airtable, Gatsby, and
              Firebase.
            </p>
          </li>
          <li>
            <a href="http://louiesnewyork.com">Louie’s New York</a> <em>2017</em>
            <p>
              Database of filming locations for the TV series <em>Louie</em>.
            </p>
          </li>
          <li>
            <a href="http://benknight.github.io/hue-harmony">Hue Harmony</a> <em>2016</em>
            <p>
              Web app for setting Philips Hue light colors according to relationships on
              an artist’s color wheel.
            </p>
          </li>
          <li>
            <a href="https://github.com/benknight/hue-alfred-workflow">
              Hue Alfred Workflow
            </a>{' '}
            <em>2016</em>
            <p>Alfred workflow for controlling a Philips Hue lighting system.</p>
          </li>
        </ul>
      </div>
    </>
  );
}
