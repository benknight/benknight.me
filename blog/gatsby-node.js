/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const _ = require('lodash');
const path = require('path');

exports.createPages = async ({ graphql, actions }) => {
  const {
    data: { posts },
  } = await graphql(`
    {
      posts: allTrelloCard(
        filter: { idList: { eq: "5e09f1a3d44af374c6220f60" }, dueComplete: {} }
      ) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `);

  const Post = path.resolve('./src/templates/Post.js');

  posts.edges.forEach(({ node: post }) => {
    const slug = _.kebabCase(post.name);
    // English
    actions.createPage({
      path: slug,
      component: Post,
      context: {
        id: post.id,
        slug,
      },
    });
  });
};
