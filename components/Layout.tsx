import React from 'react';
import Colophon from './Colophon';
import Head from 'next/head';

interface Props {
  children: React.ReactNode;
  proseClassName?: string;
  meta: Record<string, string>;
}

export default function Layout({
  children,
  proseClassName = 'prose lg:prose-lg',
  meta,
}: Props) {
  return (
    <>
      <Head>
        <title>{meta.title}</title>
      </Head>
      <Colophon />
      <article
        className={`${proseClassName} prose-stone prose-h1:mb-0 prose-hr:my-8 dark:prose-invert py-12 px-3 lg:px-0 mx-auto max-w-2xl`}>
        <div className="text-center">
          <h1>{meta.title}</h1>
          {meta.lastUpdated ? (
            <p className="mt-3">
              <i>Last updated {meta.lastUpdated}</i>
            </p>
          ) : meta.postDate ? (
            <p className="mt-3">
              <i>Posted on {meta.postDate}</i>
            </p>
          ) : null}
        </div>
        {children}
      </article>
    </>
  );
}
