import moment from 'moment';
import { InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import React from 'react';
import Head from 'next/head';
import Colophon from '../components/Colophon';
import { getPostDate, getPostSlug, getPostTitle, isPostPublic } from '../lib/utils';
import { fetchCards } from '../lib/TrelloClient';

export async function getStaticProps() {
  const postsFromTrello = (await fetchCards())
    .filter(item => isPostPublic(item))
    .map(
      (item): Post => ({
        date: getPostDate(item) ?? null,
        id: item.id,
        slug: getPostSlug(item),
        title: getPostTitle(item) ?? item.name,
      }),
    );
  const staticPosts: Post[] = [
    'reading',
    'airbnb-tips',
    'maine',
    'now',
    'saigon-roads',
    'sapiens',
    'timeline',
    'favorite-albums',
  ].map(slug => {
    const meta: Record<string, string> = require(`./${slug}.mdx`).meta;
    return {
      id: slug,
      slug,
      date: meta.lastUpdated || meta.postDate || null,
      title: meta.title,
    };
  });
  return {
    props: {
      posts: [...postsFromTrello, ...staticPosts].sort((a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        if (aDate && bDate) {
          return bDate.getTime() - aDate.getTime();
        }
        return 0;
      }),
    },
    revalidate: 1,
  };
}

export default function Posts({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>benknight.me</title>
        <link rel="canonical" href="https://benknight.me/" />
      </Head>
      <Colophon />
      <div className="px-3 py-6 max-w-xl m-auto prose dark:prose-invert">
        {posts.map(post => (
          <div className="mb-4" key={post.id}>
            <Link href={`/${post.slug}`}>
              <a className="block p-4 group no-underline text-center text-black/60 dark:text-white/60">
                <h3 className="inline m-0 underline underline-offset-2 text-xl text-inherit">
                  <b>{post.title}</b>
                </h3>
                <small className="block font-light no-underline">
                  {post.date && moment(post.date).format('LL')}
                </small>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
