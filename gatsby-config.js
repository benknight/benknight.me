require('dotenv').config();

module.exports = {
  siteMetadata: {
    author: 'Benjamin Knight',
    description: 'Designer and coder living on the bleeding edge, man',
    title: 'benknight.me',
  },
  // Listed in alphabetical order
  plugins: [
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // 'gatsby-plugin-offline',
    // {
    //   resolve: 'gatsby-plugin-manifest',
    //   options: {
    //     name: 'gatsby-starter-default',
    //     short_name: 'starter',
    //     start_url: '/',
    //     background_color: '#663399',
    //     theme_color: '#663399',
    //     display: 'minimal-ui',
    //     icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
    //   },
    // },
    // {
    //   resolve: 'gatsby-source-trello',
    //   options: {
    //     teamId: process.env.TRELLO_TEAM_ID,
    //     apiKey: process.env.TRELLO_KEY,
    //     secret: process.env.TRELLO_SECRET,
    //   },
    // },
    'gatsby-plugin-postcss',
    'gatsby-plugin-sharp',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-remote-images',
      options: {
        nodeType: 'TrelloCard',
        imagePath: 'coverImageUrl',
        name: 'coverImageLocal',
        // prepareUrl: url => url || null,
      },
    },
    {
      resolve: 'gatsby-source-airtable',
      options: {
        apiKey: process.env.AIRTABLE_API_KEY,
        tables: [
          // in alphabetical order:
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: 'Location',
          },
        ],
      },
    },
    // {
    //   resolve: 'gatsby-source-filesystem',
    //   options: {
    //     name: 'images',
    //     path: `${__dirname}/src/images`,
    //   },
    // },
    'gatsby-transformer-remark',
    'gatsby-transformer-sharp',
  ],
};
