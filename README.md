# Intro

This is a React web app built with Next.js that interfaces with a Firebase database for storing form responses and the Sanity.io API for blogging.  The current state of this frontend application does not need Sanity.io since no blogs are being rendered, but the capability is there (see the "backend" repo). The frontend portion of the application was started by following the sanity.io tutorial below.

[Read the tutorial](https://www.sanity.io/blog/build-your-own-blog-with-sanity-and-next-js?utm_source=github&github_campaing=rbt)

## Get started

```sh
# Install frontend dependencies
~/whatwhatautofrontend
> npm install

# Run Next.js in development mode
~/whatwhatautofrontend
> npm run dev
```

## Deploy as a static site

[Read the tutorial](https://www.sanity.io/blog/tutorial-host-your-sanity-based-next-js-project-on-netlify?utm_source=github&utm_campaign=netlifyexport)

```sh
~/whatwhatautofrontend
npm run export
# exports your site as static files in /out
```
