import moment from 'moment';
import { InferGetStaticPropsType } from 'next';
import { Helmet } from 'react-helmet';
import { remark } from 'remark';
import html from 'remark-html';
import Colophon from '../components/Colophon';
import { getPostSlug } from '../lib/utils';
import { fetchPosts } from '../lib/TrelloClient';

export async function getStaticProps({ params: { slug } }) {
  let post: Post;
  const posts = await fetchPosts();
  const item = posts.find(item => slug === getPostSlug(item));
  if (item) {
    post = {
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
  }
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
    paths: posts
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
      <Colophon />
      <div className="py-8 px-3 max-w-xl m-auto typography">
        <h1 className="mb-0 text-center">{post.title}</h1>
        {post.date && (
          <small className="block mt-2 text-center">
            {moment(post.date).format('LL')}
            <b className="mx-2">&middot;</b>
            {post.labels.join(',') || 'Uncategorized'}
          </small>
        )}
        <div
          className="mt-8 break-words"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </>
  );
}
