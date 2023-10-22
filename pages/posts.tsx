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
    'airbnb-tips',
    'maine',
    'saigon-roads',
    'sapiens',
    'timeline',
  ].map(slug => {
    const meta: Record<string, string> = require(`./${slug}.mdx`).meta;
    return {
      id: slug,
      slug,
      date: meta.updatedDate || meta.postDate || null,
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
        <title>Thoughts</title>
        <link rel="canonical" href="https://www.benknight.me/posts" />
      </Head>
      <Colophon />
      <div className="py-6 max-w-xl m-auto">
        {posts.map(post => (
          <div key={post.id}>
            <Link href={`/${post.slug}`}>
              <a className="inline-block p-4 typography group">
                <h3 className="m-0 text-xl link underline-offset-3 group-hover:text-blue-400">
                  {post.title}
                </h3>
                <small className="block mt-1">
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
