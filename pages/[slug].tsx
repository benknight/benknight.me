import moment from 'moment';
import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { remark } from 'remark';
import html from 'remark-html';
import Colophon from '../components/Colophon';
import { getPostDate, getPostSlug, getPostTitle, isPostPrivate } from '../lib/utils';
import { fetchCards } from '../lib/TrelloClient';

export async function getStaticProps({ params: { slug } }) {
  let post: Post;
  const cards = await fetchCards();
  const item = cards.find(item => slug === getPostSlug(item));
  if (item) {
    post = {
      date: getPostDate(item) ?? null,
      id: item.id,
      html: (await remark().use(html, { sanitize: false }).process(item.desc)).toString(),
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
        <title>{post.title}</title>
        <link rel="canonical" href={`https://www.benknight.me/${post.slug}`} />
      </Head>
      {/* {post.coverImage && (
        <Image
          alt=""
          className="block cover"
          height={800}
          objectFit="cover"
          src={post.coverImage}
          width={1600}
        />
      )} */}
      <Colophon />
      <div className="py-12 px-3 max-w-xl m-auto typography" id={`post-${post.slug}`}>
        {post.title && (
          <div className="mb-8">
            <h1 className="mb-0">{post.title}</h1>
            {post.date && (
              <small className="block mt-2">{moment(post.date).format('LL')}</small>
            )}
          </div>
        )}
        <div className="break-words" dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </>
  );
}
