# NoCMS Server

Web server for NoCMS sites.

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Dependency Status](https://david-dm.org/miles-no/nocms-server.svg)](https://david-dm.org/miles-no/nocms-server)
[![devDependencies](https://david-dm.org/miles-no/nocms-server/dev-status.svg)](https://david-dm.org/miles-no/nocms-server?type=dev)


## API


### init(config)

Initializes the server with config values.

```js
import nocmsServer from 'nocms-server';

const configObj = {
  port: 8000,
  pageService: 'http://localhost:8001',
  i18nApi: 'http://localhost:8002',
  tokenSecret: 'shhhhhh',
};

nocmsServer.init(configObj);
```

#### Available config values

| Field                    | Description                                                                    | Default                 |
|--------------------------|--------------------------------------------------------------------------------|-------------------------|
| port                     | Port of which the server is listening.                                         | `3000`                  |
| tokenSecret              | Secret for verifying user tokens. Required for publishing features             | `''`                    |
| pageService              | URL for accessing page service. Required for nocms solutions                   | `null`                  |
| logger                   | Logger function, supporting `debug`, `warn`, `info` and `error`                | `console`               |
| i18nApi                  | URL for accessing i18n servive. Required for translation features              | `null`                  |
| languageList             | Array of languages availabke to pages.                                         | `[]`                    |
| assetsFolder             | Path to folder containing static files, relative to process dir                | `assets`                |
| assetsBasePath           | Assets mount path pointing to where the files can be requested by the browser. | `/assets`               |
| clientAppScript          | Path to the client application part of the universally rendered pages          | `/assets/js/nocms.js`   |
| commonAppScript          | If the client script is built with a commons chunk, it can be put here.        | `null`                  |
| adminAppScript           | Path to the admin interface application script                                 | `/assets/js/admin.js`   |
| adminAppCss              | Path to CSS file for the admin interface                                       | `/assets/css/admin.css` |
| includeMainCss           | Flag for controlling if css should be included in the generic page output      | `true`                  |
| mainCss                  | Path to the main css file                                                      | `/assets/css/main.css`  |
| verbose                  | Flag for controlling verbose logging output                                    | `false`                 |
| compressResponses        | Flag for controlling if responses should be compressed or not                  | `true`                  |




### addRedirects(redirectsArr)

Add an array of redirects on the form, `[{ from: '<source>', to: '<target>' }, ... ]`.

`nocmsServer.addRedirects([{ from: '/foo', to: '/bar' }])`

When the user tries to access `/foo` the response ends with status 301 and `Location: /bar`-header is sent.



### addRedirect(to, from)

Adds a single redirect to the redirect list.
`nocmsServer.addRedirect('/foo', '/bar')` is equivalent to the above example.



### addDataSource(urlPattern, handlerFunc)

Although NoCMS Server uses a page datasource by default, you can override the datasource by using the `addDataSoruce` function.

```js
const peopleDataSource = (nocms) => {
return new Promise((resolve) => {
    nocms.pageData = {
      templateId: 'my-template',
      pageTitle: 'Tom is a great guy',
      uri: '/people/tom',
      // ...
      // other page data
      // ...
    };
    resolve(nocms);
  });
};
nocmsServer.addDataSource('/people/*', peopleDataSource);
```

Instead of requesting the page data service, page data are resolved using the `peopleDataSource` function for urls matching `/people/*`.
It is important that the `pageData` object assigned to nocms.pageData contains the following fields: `uri`, `templateId` and `pageTitle` as these are used 
by the included nocmsServer components.



### addComponentDataSource(componentType, handlerFunc)

// TODO



### addSites(sites)

Add site configuration for the server. If no site configuration is added, server will default to site named `localhost` with language `en` on all domains.
If the sites run on multiple domains, you can specify which domains should be resolbed to which sites. The `Host` header is used for site resolving.

```js
const sites = [
  {
    "name": "example-en",
    "domains": ["example.com", "xmpl.com"],
    "lang": "en"
  },
  {
    "name": "example-no",
    "domains": ["example.no"],
    "lang": "no"
  }
];
nocmsServer.addSites(sites);
```

If you access the server with `http://xmpl.com` in the example, the site is resolved to `example-en` with language `en`.



### setDefaultSite(name)

Set which site the requests that don't match any domain should be resolved to. The function takes the name of the site as an argument.
```js
nocmsServer.setDefaultSite('example-en');
```



### addMiddleware(name, [url,] middlewareFunc)

You can add your own middleware to execute custom operations at request scope. This is useful for adding custom tracking, applying a content security policy (CSP), check- or set cookies, etc.
The middleware takes a name argument, which is for convenience, an optional url argument, which filters which URLs the middleware should be applied to, and the middleware function which is a 
connect compliant function.

```js
const middleware = (req, res, next) => {
	res.append('X-Was-Here', 'Jørgen');
	next();
};

nocmsServer.addDataSource('Jørgen was here', '*', middleware);
```



### setAreas(areas)

When NoCMS Server receives a request for an HTML page, the server renders a react component named `Page`. The component includes the `<html>`, `<head>` and  `<body>` elements, and within the body tag, the requested template is rendered. In addition, there are certain fixed areas that are outputted if they are provided. These areas can be set using the `setAreas` function.

Available areas are:

1. **headContent:** Last in the head element
2. **topContent:** First in the top in the body element
3. **bottomContent:** After the #mainContent element
4. **script:** Last in the body element, useful for placing custom javascript files in

Note that `headContent` needs to be a react fragment, as the head element doesn't support nesting of elements. ( `<> <meta name="foo" content="foo" /> </>`)

```jsx
const areas = {
  topContent: (pageData) => { return <p>{pageData.title}: Put your top content here</p>; },
  bottomContent: <p>Put your bottom content here</p>,
  headContent: <><meta name="was here" content="Jørgen" /></>,
};

nocmsServer.setAreas(areas);
```



### setTemplates

This function is used to pass in the templates for the different pages of the site. A template has an `id` which should be a human readable identificator and a `component` which is the
react component that are eventually rendered into the `#mainContent` element.

If the template are supposed to be available in the ""Create Page" dialog in the NoCMS Publishing interface, it would also need to have set a flag named `siteTemplate` and a `name` object containing a field for each admin interface language. Finally it could have an array of section components which will be available for inclusion in the "Add Component" dialog in NoCMS Publishing.

```jsx
import Article from './Article.jsx';

const templates = [
  {
    id: 'article',
    component: Article, // Do not use jsx like <Aricle /> here, as it will be rendered later on.
    name: { // Translations for each admin interface language
      no: 'Artikkel',
      en: 'Article',
    },
    siteTemplate: true,
    sections: [
      {
        name: 'text', // section identificator
        description: 'Plain rich text component', // component description, visible in NoCMS Publishing
        categories: ['newsAndBlogpost', 'all'], // available in these groups in the NoCMS Publishing, Add Component interface.
        icon: '', // optional icon from "material icons" that is associated with the section component
        label: 'News',
        defaultData: { content: '...' },
      }
    ],
  },
  {
    id: 'custom-data-soruce-template',
    component: CustomTemplateComponent,
  },
]

nocmsServer.setTemplates(templates);
```

Page data is passed on to the template components using the spread operator, meaning that pageData.pageTitle will be available as `props.pageTitle`.



### setRobotsTxt

You can set the robots.txt file by pointing to a file relative to the project root and process working directory.
The content will be returned for `/robots.txt` requests

```js
nocmsServer.setRobotsTxt('files/robots.txt');
```


### start

This function *starts the party* by initializing the middlewares and passing on configuration values to them, and finally starting the server.




## Middleware

|  # | Name                          | Description                                                                                            | url pattern                             |
|----|-------------------------------|--------------------------------------------------------------------------------------------------------|-----------------------------------------|
|  1 | assets                        | Serving static files                                                                                   | config.assetsBasePath || `/assets`      |
|  2 | defaultFaviconHandler         | Handling default favicon requests *                                                                    | `/favicon.ico`                          |
|  3 | robotsTxtHandler              | Serving robots.txt file content                                                                        | `/robots.txt`                           |
|  4 | correlator                    | Middleware for assigning correlation id to requesst, using `nocms-express-correlation-id`              | `*`                                     |
|  5 | health                        | Endpoint for health monitoring tools using `express-healthcheck`                                       | `/health`                               |
|  6 | metrics                       | Middleware for recording request metrics using Prometheus and `nocms-express-metrics`                  | `*`                                     |
|  7 | prepare                       | Middleware for preparing request for request pipeline                                                  | `*`                                     |
|  8 | cookieParser                  | Express cookie-parser                                                                                  | `*`                                     |
|  9 | redirectTrailingSlashRequests | Urls ending with `/` are redirected. `/foo/` is redirected to `/foo`                                   | `*`                                     |
| 10 | redirects                     | If url matches a redirect (using `addRedirects`), location header are sent and response is completed.  | `*`                                     |
| 11 | siteResolver                  | Setting site and lang on `res.locals` based on host header.                                            | `*`                                     |
| 12 | nocms-auth                    | Verifying and reading tokens. Populating `claims` field on `res.locals`.                               | `*`                                     |
| 13 | nocms-reauth                  | If access token are expired, but refresh token are valid, user is redirected to `/api/login/refresh`   | `*`                                     |
| 14 | clearCacheMiddleware          | Middleware for clearing entire Varnish cache. Requires publisher claim                                 | `*`                                     |
| 15 | externalMiddlewares           | Per project custom middleware added using `addMiddleware`.                                             | `*`                                     |
| 16 | compression                   | Compress responses using `compression` package.                                                        | `*`                                     |
| 17 | requestHandler                | Request pipeline middleware                                                                            | `*`                                     |
| 18 | errorHandler                  | Error handler middleware catching exceptions and providing error responses                             | `*`                                     |

(*) Browsers try to find favicon at /favicon.ico, but favicon is specified in Page.jsx to be found at /assets/favicon.ico 

## Request pipeline


## Page Data Source


## Universal rendering


## React Components

### Page Component


### NoCMSClient Component


### MainContent Component




## Commit message format and publishing

This repository is published using `semantic-release`, with the default [AngularJS Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit).
