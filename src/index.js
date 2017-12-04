const express = require('express');
const cookieParser = require('cookie-parser');
const correlator = require('nocms-express-correlation-id');
const expressHealth = require('express-healthcheck');
const prometheus = require('prom-client');
const expressMetrics = require('nocms-express-metrics');
const nocmsAuth = require('nocms-auth');

const redirectTrailingSlashRequestsMiddleware = require('./middleware/redirect_trailing_slash_requests_middleware');
const redirects = require('./middleware/redirects');
const siteResolver = require('./middleware/site_resolver');
const clearCacheMiddleware = require('./middleware/clear_cache_middleware');

const requestHandler = require('./middleware/request_handler/');

const errorHandler = require('./middleware/error_handler_middleware');

let config = {
  port: 3000,
  tokenSecret: '',
  logger: console,
  pageService: null,
  i18nApi: null,
  languageList: [],
};

let app = null;

const externalMiddlewares = [];
const middlewareList = [];

const initMiddleware = () => {
  return [
    {
      name: 'cookieParser',
      fn: cookieParser(),
    },
    {
      name: 'assets', // TODO: Should be removed
      url: '/assets',
      fn: express.static('assets', { fallthrough: false, index: false, maxAge: 0 }),
    },
    {
      name: 'correlator',
      fn: correlator(),
    },
    {
      name: 'health',
      url: '/health',
      fn: expressHealth(),
    },
    {
      name: 'metrics',
      fn: expressMetrics({
        prometheus,
        enableNodeMetrics: true,
        enableGCMetrics: true,
      }),
    },
    {
      name: 'redirectTrailingSlashRequests',
      fn: redirectTrailingSlashRequestsMiddleware,
    },
    {
      name: 'redirects',
      fn: redirects.middleware,
    },
    {
      name: 'siteResolver',
      fn: siteResolver.middleware,
    },
    {
      name: 'nocms-auth',
      fn: nocmsAuth.readClaims(config.adminTokenSecret, config.logger),
    },
    {
      name: 'clearCacheMiddleware',
      fn: clearCacheMiddleware,
    },
  ];
};

let api = {};

const init = (cfg = {}) => {
  config = Object.assign(config, cfg);
  app = express();
  return api;
};

const addRedirects = (redirectsArr) => {
  redirects.addRedirects(redirectsArr);
  return api;
};

const addRedirect = (from, to) => {
  redirects.addRedirect(from, to);
  return api;
};

const addSites = (sites) => {
  siteResolver.addSites(sites);
  return api;
};

const setDefaultSite = (name, lang) => {
  siteResolver.setDefaults(name, lang);
  return api;
};

const getMiddleware = () => {
  return middlewareList;
};

const setAreas = (areas) => {
  requestHandler.setAreas(areas);
  return api;
};

const start = () => {
  requestHandler.setConfig(config);
  errorHandler.setConfig(config);
  let middleware = initMiddleware();
  api.addMiddleware('requestHandler', requestHandler.middleware); // TODO: Should this call next?
  api.addMiddleware('errorHandler', errorHandler.middleware); // TODO: Should error handlers be added seperately?
  // TODO: Add middleware: Request logger

  middleware = middleware.concat(externalMiddlewares);

  middleware.forEach((m) => {
    middlewareList.push(`${m.name}${m.url ? `@${m.url}` : ''}`);
    if (m.url) {
      app.use(m.url, m.fn);
    } else {
      app.use(m.fn);
    }
  });

  app.listen(config.port, () => {
    config.logger.info(`Main web server listening on port ${config.port}`);
  });

  return api;
};

const addMiddleware = (name, url, fn) => {
  const mw = {
    name,
    url,
    fn,
  };
  if (typeof url === 'function') {
    mw.fn = url;
    mw.url = null;
  }
  externalMiddlewares.push(mw);
  return api;
};

const addDataSource = (pattern, fn) => {
  requestHandler.addDataSource(pattern, fn);
  return api;
};

const setTemplates = (templates) => {
  requestHandler.setTemplates(templates);
  return api;
};

api = {
  init,
  addRedirects,
  addRedirect,
  addDataSource,
  addSites,
  setDefaultSite,
  addMiddleware,
  start,
  getMiddleware,
  setAreas,
  setTemplates,
};

module.exports = api;
