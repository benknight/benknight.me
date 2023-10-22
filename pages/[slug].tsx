import moment from 'moment';
import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { remark } from 'remark';
import html from 'remark-html';
import Colophon from '../components/Colophon';
import { getPostDate, getPostSlug, getPostTitle, isPostPrivate } from '../lib/utils';
import { fetchCards } from '../lib/TrelloClient';
import Layout from '../components/Layout';

export async function getStaticProps({ params: { slug } }) {
  let post: Post;
  const cards = await fetchCards();
  const item = cards.find(item => slug === getPostSlug(item));
  if (item) {
    post = {
      date: getPostDate(item) ?? null,
      id: item.id,
      html: (await remark().use(html, { sanitize: false }).process(item.desc)).toString(),
      name: item.name,
      slug: getPostSlug(item),
      title: getPostTitle(item) ?? null,
    };
  }
  return {
    notFound: !post || isPostPrivate(item),
    props: {
      post,
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const cards = await fetchCards();
  return {
    paths: cards
      .filter(item => Boolean(getPostSlug(item)))
      .map((item: any) => ({
        params: {
          slug: getPostSlug(item),
        },
      })),
    fallback: 'blocking',
  };
}

export default function Post({ post }: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!post) {
    return null;
  }
  return (
    <>
      <Head>
        <link rel="canonical" href={`https://benknight.me/${post.slug}`} />
      </Head>
      <Layout meta={{ title: post.title || post.name, postDate: post.date }}>
        <div className="break-words" dangerouslySetInnerHTML={{ __html: post.html }} />
      </Layout>
    </>
  );
}
