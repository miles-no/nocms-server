/* eslint no-param-reassign: off */
import React from 'react';
import ReactDOM from 'react-dom/server';
import Page from '../../../components/Page.jsx';
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

export function fetchTemplate(nocms) {
  return new Promise((resolve, reject) => {
    if (nocms.exception) {
      reject(nocms);
      return;
    }
    nocms.renderTemplate = () => {
      return renderResponse(nocms, nocms.pageData);
    };
    resolve(nocms);
  });
}

export function renderException(nocms) {
  const titles = {
    404: dictionary('Siden finnes ikke'),
    500: dictionary('Det oppsto en feil'),
  };

  const errorPageData = {
    templateId: 'errorPage',
    statusCode: nocms.exception.statusCode.toString(),
    uri: nocms.url,
    pageTitle: titles[nocms.exception.statusCode.toString()] || dictionary('Det oppsto en feil'),
    lang: nocms.siteLang,
  };
  return renderResponse(nocms, errorPageData);
}

export function setAreas(a) {
  areas = Object.assign(areas, a);
}

export function setTemplates(tmpl) {
  templates = tmpl;
}
