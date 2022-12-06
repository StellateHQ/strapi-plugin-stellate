# `strapi-plugin-stellate` (alpha)

This plugin helps with using [Stellate](https://stellate.co) in front of a Strapi GraphQL API.

It automatically takes care of invalidating the cache when content is updated in Strapi, no matter the source of the update. (admin panel, GraphQL mutation, REST API, etc)

## Usage

1. [Set up Stellate for your Strapi GraphQL API](https://docs.stellate.co/docs/how-to-get-started)
1. Install the Strapi plugin: `npm install strapi-plugin-stellate`
1. Add the plugin to `./config/plugins.js` and add your Stellate service's name and [purging API token](https://docs.stellate.co/docs/purging-api#authentication):
  
  ```js
  module.exports = {
    stellate: {
      config: {
        serviceName: "...", // REQUIRED: Your Stellate service's name
        purgingAPIToken: "...", // REQUIRED: Your Purging API token
        soft: false, // OPTIONAL: Whether you want to use soft purging
      },
    },
  };
  ```
