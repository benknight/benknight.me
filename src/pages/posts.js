import { Link, graphql } from 'gatsby';
import moment from 'moment';
import React from 'react';
import Helmet from 'react-helmet';
import Colophon from '../components/Colophon';

export const query = graphql`
  {
    posts: allTrelloCard(
      filter: { dueComplete: { eq: true } }
      sort: { fields: due, order: DESC }
    ) {
      edges {
        node {
          id
          name
          slug
          due
          dueComplete
          childMarkdownRemark {
            html
          }
          labels {
            name
          }
        }
      }
    }
  }
`;

export default function BlogIndex({ data: { posts } }) {
  return (
    <>
      <Helmet>
        <title>Thoughts</title>
      </Helmet>
      <Colophon />
      <div className="py-6 max-w-xl m-auto">
        {posts.edges.map(({ node: post }) => (
          <Link
            className="block text-center px-4 py-6 typography"
            key={post.id}
            to={`/${post.slug}`}>
            <h2 className="m-0">{post.name}</h2>
            <small className="block mt-2 text-center">
              {moment(post.due).format('LL')}
              <span className="mx-2">&middot;</span>
              {post.labels.map(label => label.name).join(',')}
            </small>
          </Link>
        ))}
      </div>
    </>
  );
}
