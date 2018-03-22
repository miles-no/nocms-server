import express from 'express';
import cookieParser from 'cookie-parser';
import correlator from 'nocms-express-correlation-id';

import expressHealth from 'express-healthcheck';
import prometheus from 'prom-client';
import expressMetrics from 'nocms-express-metrics';
import { readClaims } from 'nocms-auth';
import compression from 'compression';

import prepare from './middleware/prepare';
import redirectTrailingSlashRequestsMiddleware from './middleware/redirect_trailing_slash_requests_middleware';
import redirects from './middleware/redirects';
import siteResolver from './middleware/site_resolver';
import clearCacheMiddleware from './middleware/clear_cache_middleware';
import requestHandler from './middleware/request_handler/';
import errorHandler from './middleware/error_handler_middleware';
import assetsErrorHandler from './middleware/assets_error_handler_middleware';
import robotsTxtMiddleware from './middleware/robots_txt';

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
  verbose: false,
  compressResponses: true,
};

let app = null;

const externalMiddlewares = [];
const middlewareList = [];

const initMiddleware = () => {
  return [
    {
      name: 'assets',
      url: config.assetsBasePath,
      fn: express.static(config.assetsFolder, { fallthrough: false, index: false }),
    },
    {
      name: 'defaultFaviconHandler',
      url: '/favicon.ico',
      fn: (req, res) => { res.status(404).end(); },
    },
    {
      name: 'robotsTxtHandler',
      url: '/robots.txt',
      fn: robotsTxtMiddleware.middleware,
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
      name: 'prepare',
      fn: prepare(config),
    },
    {
      name: 'cookieParser',
      fn: cookieParser(),
    },
    {
      name: 'redirectTrailingSlashRequests',
      fn: redirectTrailingSlashRequestsMiddleware(config),
    },
    {
      name: 'redirects',
      fn: redirects.middleware(config),
    },
    {
      name: 'siteResolver',
      fn: siteResolver.middleware(config),
    },
    {
      name: 'nocms-auth',
      fn: readClaims(config.adminTokenSecret, config.logger),
    },
    {
      name: 'clearCacheMiddleware',
      fn: clearCacheMiddleware(config),
    },
  ];
};

let api = {};

const init = (cfg = {}) => {
  config = Object.assign(config, cfg);
  app = express();
  return api;
};

const setRobotsTxt = (path) => {
  robotsTxtMiddleware.addRobotsTxt(path);
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

const setDefaultSite = (name) => {
  siteResolver.setDefaultSite(name);
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
  assetsErrorHandler.setConfig(config);
  let middleware = initMiddleware();

  if (config.compressResponses) {
    api.addMiddleware('compression', compression());
  }

  api.addMiddleware('requestHandler', requestHandler.middleware); // TODO: Should this call next?
  api.addMiddleware('assetsErorHandler', `${config.assetsBasePath}/*`, assetsErrorHandler.middleware);
  api.addMiddleware('errorHandler', errorHandler.middleware); // TODO: Should error handlers be added seperately?

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
    const defaultSite = siteResolver.getDefault();
    const domains = siteResolver.getDomains();
    config.logger.info('NoCMS server started with the following config', {
      port: config.port,
      tokenSecret: 'SECRET',
      pageService: config.pageService,
      i18nApi: config.i18nApi,
      languageList: config.languageList,
      assetsFolder: config.assetsFolder,
      assetsBasePath: config.assetsBasePath,
      clientAppScript: config.clientAppScript,
      adminAppScript: config.adminAppScript,
      adminAppCss: config.adminAppCss,
      includeMainCss: true,
      mainCss: config.mainCss,
      verbose: config.verbose,
      compressResponses: config.compressResponses,
      domains,
      defaultSite: { name: defaultSite.name, lang: defaultSite.lang },
    });
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

const addComponentDataSource = (componentType, fn) => {
  requestHandler.addComponentDataSource(componentType, fn);
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
  addComponentDataSource,
  addSites,
  setDefaultSite,
  addMiddleware,
  start,
  getMiddleware,
  setAreas,
  setTemplates,
  setRobotsTxt,
};

const nocmsServer = api;

export default nocmsServer;
