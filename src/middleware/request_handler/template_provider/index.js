/* eslint no-param-reassign: off */
import React from 'react';
import ReactDOM from 'react-dom/server';
import Page from '../../../components/Page';
import { dictionary } from '../i18n';

let areas = {};
let templates = [];
const renderResponse = (nocms, pageData) => {
  const adminConfig = Object.assign(nocms.config.admin, { site: nocms.site });
  const pageOutput = (<Page
    pageData={pageData}
    claims={nocms.claims}
    i18n={nocms.i18n}
    runningEnvironment={nocms.runningEnvironment}
    config={nocms.config.client}
    pageConfig={nocms.config.pageConfig}
    site={nocms.site}
    adminConfig={adminConfig}
    areas={areas}
    templates={templates}
  />);

  try {
    return `<!DOCTYPE html>${ReactDOM.renderToStaticMarkup(pageOutput)}`;
  } catch (ex) {
    nocms.logger.error('React render to static markup exception', ex);
    return dictionary('Det oppsto en feil');
  }
};

const fetchTemplate = (nocms) => {
  return new Promise((resolve, reject) => {
    if (nocms.exception) {
      if (nocms.verbose) {
        nocms.logger.debug('requestHandler: rejecting fetch template because of exception', nocms.exception);
      }
      reject(nocms);
      return;
    }
    nocms.renderTemplate = () => {
      return renderResponse(nocms, nocms.pageData);
    };
    if (nocms.verbose) {
      nocms.logger.debug('requestHandler: fetchTemplate: renderTemplate function added to nocms object');
    }
    resolve(nocms);
  });
};

const renderException = (nocms) => {
  const titles = {
    404: dictionary('Siden finnes ikke', nocms.siteLang),
    500: dictionary('Det oppsto en feil', nocms.siteLang),
  };

  const errorPageData = {
    templateId: 'errorPage',
    statusCode: nocms.exception.statusCode.toString(),
    uri: nocms.url,
    pageTitle: titles[nocms.exception.statusCode.toString()] || dictionary('Det oppsto en feil'),
    lang: nocms.siteLang,
  };

  if (nocms.verbose) {
    nocms.logger.debug('requestHandler: pageRenderer: render error template', nocms.exception);
  }

  return renderResponse(nocms, errorPageData);
};

const setAreas = (a) => {
  areas = a;
};

const setTemplates = (tmpl) => {
  templates = tmpl;
};

export default {
  fetchTemplate,
  renderException,
  setAreas,
  setTemplates,
};
