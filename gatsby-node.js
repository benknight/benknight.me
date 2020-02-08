/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const axios = require('axios');
const crypto = require('crypto');
const _ = require('lodash');
const path = require('path');

require('dotenv').config();

exports.createPages = async ({ graphql, actions }) => {
  const {
    data: { posts },
  } = await graphql(`
    {
      posts: allTrelloCard {
        edges {
          node {
            id
            name
            slug
          }
        }
      }
    }
  `);

  posts.edges.forEach(({ node: post }) => {
    actions.createPage({
      path: `/${post.slug}`,
      component: path.resolve('./src/components/PostTemplate.js'),
      context: {
        id: post.id,
        slug: post.slug,
      },
    });
  });
};

exports.sourceNodes = async ({ actions }) => {
  const { createNode } = actions;
  try {
    const { data: cards } = await axios.get(
      `https://api.trello.com/1/lists/${process.env.TRELLO_LIST}/cards`,
      {
        params: {
          attachments: true,
          customFieldItems: true,
          key: process.env.TRELLO_KEY,
          token: process.env.TRELLO_TOKEN,
        },
      },
    );
    cards.map(card => {
      const data = {
        ...card,
        slug: _.get(card, 'customFieldItems[0].value.text', _.kebabCase(card.name)),
        due: card.due || new Date().toISOString(),
        dueComplete: _.get(card, 'dueComplete', false),
        coverImageUrl: card.idAttachmentCover
          ? card.attachments.find(a => a.id === card.idAttachmentCover).url
          : 'https://benknight.me/portrait-landscape.jpg',
      };
      const cardDigest = crypto
        .createHash('md5')
        .update(JSON.stringify(data))
        .digest('hex');
      const cardNode = Object.assign(data, {
        children: [],
        parent: 'root',
        internal: {
          content: card.desc,
          mediaType: 'text/markdown',
          type: 'TrelloCard',
          contentDigest: cardDigest,
        },
      });
      createNode(cardNode);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
