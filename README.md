# DoCharge.me main website

## Localization (i18n) Example with Next.js + Contentful

**ℹ️ Based on [our Getting Started tutorial](https://docs.stackbit.com/getting-started) in its completed state.**

This website supports localization in two flavours:

1. **Field-level localization** is supported by both Contentful and Stackbit. It is only used here for the "Header Text" field in the Site Configuration content object.
2. **Document-level localization** is not directly supported by Contentful. However, by configuring Stackbit appropriately, the visual editor provides a native-like localization experience at the content object-level for all localized models. See [Stackbit config file](./stackbit.config.ts).

Locale-aware routing in the website is implemented via [Next.js i18n](https://nextjs.org/docs/advanced-features/i18n-routing). Note that for the default locale (en-US in this site) no locale prefix is added to pathnames. See [Next.js config file](./next.config.js).

Notes:

1. When switching between locales, the client-side code is navigating to the same route but with the selected locale. If there's no such page, a 404 page is shown (defining a different behavior is up to you).
1. The code implements bi-directional syncing between the locale switcher in the Stackbit visual editor (which controls which pages & fields you can see & edit) and the custom locale switcher rendered in the header of all site pages. This is fully optional, but makes for a more streamlined experience for editors working on multiple locales.


There are two ways to start using this project: importing it via the UI, or developing locally.

## Developing Locally

### Prerequisites

Before you begin, please make sure you have the following:

- Contentful account
- Node v14 or later

### Clone this repository

Clone this repository, then run `npm install` in its root directory.

### Create Contentful Space

After signing into Contentful, create a new space.

### Generate Management Token

If you don't already have a management token (or _personal access token_), generate one. To do so, go into your new empty space, then:

1. Click _Settings_
1. Choose _API Keys_
1. Select the _Content management tokens_ tab
1. Click the button to generate a new token

![Generate content management token](./docs/generate-mgmt-token.png)

### Generate Preview & Delivery API Keys

From the same place you generated the management token, you can now generate API access keys.

1. Select the *content delivery / preview tokens* tab
1. Choose *Add API key*

### Set Environment Variables

In your project, duplicate `.env.example` to `.env`.

Fill in the values in the file based on the keys you've created.

Note: the Contentful space ID can be viewed and copied via *Settings->General Settings* in Contentful.

### Import Content

Import the provided content models & content into Contentful by running the `import.js` script:

    node ./contentful/import.js

If the import fails to run, make sure that you've run `npm install` and that all keys in your `.env` file are set correctly.

### Run the Website

Run the Next.js development server:

    npm run dev

Visit [localhost:3000](http://localhost:3000) and you should see the example content you imported into your new Contentful space.

