import React from 'react';
import templates from './templates';
import ESI from '../src/nocms/components/atoms/ESI.jsx';

const nocms = require('../nocms-render-server/');
const config = require('nocms-config-client').get();
const redirects = require('../server/redirects');
const HeadContent = require('./HeadContent.jsx');
const logger = require('nocms-logger');

console.log('===========================');
console.log('STARTING SERVER PACKAGE POC');
console.log('===========================');
console.log('TODO: Move publisher login into admin_login container');
console.log('TODO: Add token secret to main_web_server config to enable nocms-auth');
console.log('TODO: nocms-auth stores claims in req.locals. Should be res.locals');
console.log('TODO: Component data provider has been removed. Can we use ESI here instead?');
console.log('TODO: Upgrade to React 16 in order to be able to inject stuff in head');
console.log('TODO: Example with verifyClaim');
console.log('TODO: It seems like claims are default array but object when it is resolved.');
console.log('DISCUSS: MainContent sets moment locals. Should moment be a depenency in this package?');

const initConfig = {
  useGzip: false,
  adminTokenSecret: config.adminTokenSecret,
};

const myRequestLogger = (req, res, next) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  console.log(req.url);
  console.log(JSON.stringify(res.locals, null, '  '));
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  next();
};

const localsCombiner = (req, res, next) => {
  Object.assign(res.locals, req.locals);
  next();
};

const app1DataSource = (nocms) => {
  return new Promise((resolve) => {
    nocms.pageData = {
      templateId: 'foo',
      pageTitle: 'Foo',
    };
    resolve(nocms);
  });
};

const areas = {
  topContent: (pageData) => { return <ESI src={`/fragments/menu?site=${pageData.site || config.defaultSite}`} />; },
  bottomContent: <ESI src={'/fragments/footer?site=no'} />,
};

const server = nocms.init(initConfig)
  .addMiddleware('localsCombiner', localsCombiner) // TODO: Remove after nocms-auth is updated
  .addMiddleware('middlwareLogger', myRequestLogger)
  .addRedirects(redirects)
  .addRedirect('/foo', '/bar')
  .addSites(config.sites)
  .setDefaultSite(config.defaultSite, config.defaultLang)
  .addDataSource('*', app1DataSource) // Better name
  .setAreas(areas)
  .setTemplates(templates)
  .on('error', logger.error)
  .start();

console.log('MIDDLEWARE: ', server.getMiddleware());
