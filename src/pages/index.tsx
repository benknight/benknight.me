import { InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Helmet from 'react-helmet';
import KnightIcon from '../../public/knight.svg';

type Link = {
  href: string,
  text: string,
};

export async function getStaticProps() {
  const response = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Links?view=Grid%20view`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      },
    },
  );
  const data = await response.json();
  const links: Link[] = data.records
    .map((record: any) => record.fields)
    .map((fields: any) => ({
      href: fields.href,
      text: fields.text,
    }));
  return {
    props: {
      links,
    },
    revalidate: 1,
  };
}

export default function Index({ links }: InferGetStaticPropsType<typeof getStaticProps>) {
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
          {links.map(link => (
            <li className="my-6">
              <Link href={link.href}>
                <a rel="author">{link.text}</a>
              </Link>
            </li>
          ))}
          <li className="mt-12">
            <KnightIcon className="relative left-[-0.25rem] fill-current block w-4 h-4 mx-auto" />
          </li>
        </ul>
      </div>
    </>
  );
}
