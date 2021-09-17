import moment from 'moment';
import { InferGetStaticPropsType } from 'next';
import { Helmet } from 'react-helmet';
import { remark } from 'remark';
import html from 'remark-html';
import Colophon from '../components/Colophon';
import getPostSlug from '../lib/getPostSlug';
import { fetchPosts } from '../lib/TrelloClient';

export async function getStaticProps({ params: { slug } }) {
  const posts = await fetchPosts();
  const item = posts.find(item => slug === getPostSlug(item));
  const post: Post = {
    date: item.due,
    id: item.id,
    labels: item.labels.map(label => label.name),
    html: (
      await remark()
        .use(html, { sanitize: false })
        .process(item.desc)
    ).toString(),
    title: item.name,
  };
  return {
    notFound: !post,
    props: {
      post,
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const posts = await fetchPosts();
  return {
    paths: posts.map((item: any) => ({
      params: {
        slug: getPostSlug(item),
      },
    })),
    fallback: false,
  };
}

export default function Post({ post }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Helmet>
        <title>{post.title}</title>
      </Helmet>
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
      <div className="py-8 px-3 max-w-xl m-auto typography">
        <h1 className="px-3 mb-0 text-center">{post.title}</h1>
        <small className="block mt-2 mb-8 text-center">
          {moment(post.date).format('LL')}
          <b className="mx-2">&middot;</b>
          {post.labels.join(',') || 'Uncategorized'}
        </small>
        <div className="content" dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
      <Colophon />
    </>
  );
}
