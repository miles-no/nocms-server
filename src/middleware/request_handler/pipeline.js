import DataProvider from './data_provider/';
import TemplateProvider from './template_provider/';
import PageRenderer from './page_renderer/';
import I18nProvider from './i18n/';

const api = {
  init(nocms) {
    return new Promise((resolve) => {
      resolve(nocms);
    });
  },
  fetchData: DataProvider.fetchData,
  fetchTemplate: TemplateProvider.fetchTemplate,
  fetchI18nData: I18nProvider.fetchI18nData,
  renderPage: PageRenderer.renderPage,
  renderLoginForm: TemplateProvider.renderLoginForm,
  sendRedirect: (nocms) => {
    nocms.res
      .append('Location', nocms.redirect)
      .append('x-correlation-id', nocms.correlationId)
      .status(301).end();
  },
  sendJsonResponse: (nocms) => {
    nocms.res.status(nocms.statusCode || 200)
      .append('Content-Type', 'application/json')
      .append('x-correlation-id', nocms.correlationId)
      .send(JSON.stringify({ pageData: nocms.pageData }))
      .json({ pageData: nocms.pageData })
      .end();
  },
  sendHtmlResponse: (nocms) => {
    nocms.res.status(nocms.statusCode || 200)
      .append('Cache-Control', 'public')
      .append('Content-Type', 'text/html')
      .append('x-correlation-id', nocms.correlationId)
      .send(nocms.html)
      .end();
  },
};

export default api;
