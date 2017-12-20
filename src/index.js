import express from 'express';
import cookieParser from 'cookie-parser';
import correlator from 'nocms-express-correlation-id';

import expressHealth from 'express-healthcheck';
import prometheus from 'prom-client';
import expressMetrics from 'nocms-express-metrics';
import { readClaims } from 'nocms-auth';

import redirectTrailingSlashRequestsMiddleware from './middleware/redirect_trailing_slash_requests_middleware';
import redirects from './middleware/redirects';
import siteResolver from './middleware/site_resolver';
import clearCacheMiddleware from './middleware/clear_cache_middleware';
import requestHandler from './middleware/request_handler/';
import errorHandler from './middleware/error_handler_middleware';

let config = {
  port: 3000,
  tokenSecret: '',
  logger: console,
  pageService: null,
  i18nApi: null,
  languageList: [],
  assetsFolder: 'assets',
  assetsBasePath: '/assets',
  clientAppScript: '/assets/js/nocms.js',
  adminAppScript: '/assets/js/admin.js',
  adminAppCss: '/assets/css/admin.css',
  includeMainCss: true,
  mainCss: '/assets/css/main.css',
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
      name: 'assets',
      url: config.assetsBasePath,
      fn: express.static(config.assetsFolder, { fallthrough: false, index: false, maxAge: 0 }),
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
      fn: readClaims(config.adminTokenSecret, config.logger),
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

const nocmsServer = api;

export default nocmsServer;
