import { graphql } from 'gatsby';
import React from 'react';

export const query = graphql`
  query($id: String!) {
    post: trelloCard(id: { eq: $id }) {
      name
      due
      labels {
        name
      }
      childMarkdownRemark {
        html
      }
    }
  }
`;

const Post = ({ data: { post } }) => {
  return (
    <>
      <em>{new Date(post.due).toLocaleString()}</em>
      <div dangerouslySetInnerHTML={{ __html: post.childMarkdownRemark.html }} />
    </>
  );
};

export default Post;
