/* eslint-disable no-console */
import React from 'react';
import logger from 'nocms-logger';

import nocmsServer from 'nocms-server'; // eslint-disable-line
import templates from './templates';
import redirects from './redirects';
import HeadContent from './components/HeadContent.jsx';


logger.setConfig({
  timestampFormat: '%d %H:%M:%S',
  logFormat: '%T %L - %C',
  logLevel: 'debug',
  logAsJson: false,
  useChalk: true,
  output: {
    all: ['console'],
  },
});

logger.info('===========================');
logger.info('STARTING SERVER PACKAGE POC');
logger.info('===========================');
logger.info('TODO: Upgrade to React 16 in order to be able to inject stuff in head');
logger.info('TODO: Hook up client side script in example');
logger.info('TODO: nocms-auth stores claims in req.locals. Should be res.locals');
logger.info('TODO: miles.no replace moment locale that was removed from MainContent');
logger.info('TODO: miles.no replace componentData requests with ESI as componentData has been removed');

logger.info('TODO: Move publisher login into admin_login container');
logger.info('TODO: Example with verifyClaim');
logger.info('TODO: It seems like claims are default array but object when it is resolved.');
logger.info('DISCUSS: MainContent sets moment locals. Should moment be a depenency in this package?');

const initConfig = {
  useGzip: false,
  adminTokenSecret: 'shhhhhh',
  pageService: 'localhost:3001',
  i18nApi: 'localhost:3002',
  languageList: ['no', 'en'],
  logger,
  port: 9000,
  assetsFolder: 'example/assets',
  includeMainCss: true,
  verbose: true,
};

const sites = [
  {
    name: 'nocms-example',
    domains: ['localhost:9080'],
    lang: 'en',
  },
  {
    name: 'nocms-example-2',
    domains: ['127.0.0.1:9000'],
    lang: 'no',
  },
];

const myRequestLogger = (req, res, next) => {
  logger.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  logger.info(req.url);
  logger.info(JSON.stringify(res.locals, null, '  '));
  logger.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  next();
};

const localsCombiner = (req, res, next) => {
  Object.assign(res.locals, req.locals);
  next();
};

const app1DataSource = (nocms) => {
  return new Promise((resolve) => {
    nocms.pageData = {
      templateId: 'example',
      pageTitle: 'Foo',
    };
    resolve(nocms);
  });
};

const areas = {
  topContent: (pageData) => { return <p>{pageData.title}: Put your top content here</p>; },
  bottomContent: <p>Put your bottom content here</p>,
  headContent: <HeadContent />,
};

const server = nocmsServer.init(initConfig)
  .addMiddleware('localsCombiner', localsCombiner) // TODO: Remove after nocms-auth is updated
  // .addMiddleware('middlwareLogger', myRequestLogger)
  .addRedirects(redirects)
  .addRedirect('/foo', '/bar')
  .addSites(sites)
  .setDefaultSite('nocms-example', 'en') // TODO: Lang could be gotten from sites[site].lang
  .addDataSource('*', app1DataSource) // Better name
  .setAreas(areas)
  .setTemplates(templates)
  .start();

logger.info('MIDDLEWARE: ', server.getMiddleware());
