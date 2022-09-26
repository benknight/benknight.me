import moment from 'moment';
import { InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import React from 'react';
import Head from 'next/head';
import Colophon from '../components/Colophon';
import { getPostSlug } from '../lib/utils';
import { fetchPosts } from '../lib/TrelloClient';

export async function getStaticProps() {
  const posts = await fetchPosts();
  return {
    props: {
      posts: posts
        .filter(item => item.dueComplete && Boolean(getPostSlug(item)))
        .map((item): Post => ({
          date: item.due || '',
          id: item.id,
          labels: item.labels.map(label => label.name),
          slug: getPostSlug(item),
          title: item.name,
        })),
    },
    revalidate: 1,
  };
}

export default function Posts({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Thoughts</title>
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
                  {moment(post.date).format('LL')}
                  <span className="mx-2">&middot;</span>
                  {post.labels.join(',') || 'Uncategorized'}
                </small>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
