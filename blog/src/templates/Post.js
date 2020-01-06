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
      <div className="post ph3">
        {post.coverImageLocal && (
          <Img
            alt=""
            className={styles.cover}
            fluid={post.coverImageLocal.childImageSharp.fluid}
            objectFit="cover"
          />
        )}
        <div className="pv4 measure-wide center">
          <h1 className="mb0 ph3 tc">{post.name}</h1>
          <small className="db mt2 mb4 tc">
            {moment(post.due).format('LL')}
            <span className="mh2 white">&middot;</span>
            {post.labels.map(label => label.name).join(',')}
          </small>
          <div
            className={`${styles.content} user-html`}
            dangerouslySetInnerHTML={{ __html: post.childMarkdownRemark.html }}
          />
        </div>
      </div>
    </>
  );
};
