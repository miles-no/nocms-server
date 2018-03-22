/* eslint-disable no-console */
import React from 'react';
import nocmsServer from 'nocms-server'; // eslint-disable-line
import logger from 'nocms-logger';
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
    default: true,
  },
];

const myRequestLogger = (req, res, next) => {
  logger.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  logger.info(req.url);
  logger.info(JSON.stringify(res.locals, null, '  '));
  logger.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
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
  .addMiddleware('middlwareLogger', myRequestLogger)
  .addRedirects(redirects)
  .setRobotsTxt('example/src/robots.txt')
  .addRedirect('/foo', '/bar')
  .addSites(sites)
  .setDefaultSite('nocms-example')
  .addDataSource('*', app1DataSource) // Better name
  .setAreas(areas)
  .setTemplates(templates)
  .start();

logger.info('MIDDLEWARE: ', server.getMiddleware());
