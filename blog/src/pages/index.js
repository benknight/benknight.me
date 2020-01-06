import { Link, graphql } from 'gatsby';
import moment from 'moment';
import React from 'react';
import Helmet from 'react-helmet';

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

export default ({ data: { posts } }) => {
  return (
    <>
      <Helmet>
        <title>Thoughts</title>
      </Helmet>
      <div className="pv4 mw6 center">
        {posts.edges.map(({ node: post }) => (
          <Link
            className="link color-inherit db tc pa4 link"
            key={post.id}
            to={`/${post.slug}`}>
            <div className="h2 ma0">{post.name}</div>
            <small className="db mt2 tc">
              {moment(post.due).format('LL')}
              <span className="mh2">&middot;</span>
              {post.labels.map(label => label.name).join(',')}
            </small>
          </Link>
        ))}
      </div>
    </>
  );
};
