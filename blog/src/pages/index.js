import { Link, graphql } from 'gatsby';
import _kebabCase from 'lodash/kebabCase';
import React from 'react';
import Page from '../components/Page';

export const query = graphql`
  query {
    posts: allTrelloCard(
      filter: { idList: { eq: "5e09f1a3d44af374c6220f60" }, dueComplete: { eq: true } }
    ) {
      edges {
        node {
          id
          name
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

const IndexPage = ({ data: { posts } }) => {
  return (
    <Page>
      {posts.edges.map(({ node: post }) => (
        <Link
          className="db link white tc f3"
          key={post.id}
          to={`/${_kebabCase(post.name)}`}>
          {post.name}
        </Link>
      ))}
    </Page>
  );
};

export default IndexPage;
