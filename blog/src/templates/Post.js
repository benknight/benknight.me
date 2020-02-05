import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import moment from 'moment';
import React from 'react';
import Helmet from 'react-helmet';
import styles from './Post.module.css';

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
      coverImageLocal {
        childImageSharp {
          fluid(maxWidth: 1600, maxHeight: 800) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`;

export default ({ data: { post } }) => {
  return (
    <>
      <Helmet>
        <title>{post.name}</title>
      </Helmet>
      {post.coverImageLocal && (
        <Img
          alt=""
          className={`${styles.cover} block`}
          fluid={post.coverImageLocal.childImageSharp.fluid}
          objectFit="cover"
        />
      )}
      <div className="py-8 px-3 max-w-xl m-auto typography">
        <h1 className="px-3 mb-0 text-center">{post.name}</h1>
        <small className="block mt-2 mb-8 text-center">
          {moment(post.due).format('LL')}
          <b className="mx-2">&middot;</b>
          {post.labels.map(label => label.name).join(',') || 'Uncategorized'}
        </small>
        <div
          className={`${styles.content}`}
          dangerouslySetInnerHTML={{ __html: post.childMarkdownRemark.html }}
        />
      </div>
    </>
  );
};
