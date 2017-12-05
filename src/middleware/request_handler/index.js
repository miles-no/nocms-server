import requestPipeline from './pipeline';
import dataProvider from './data_provider';
import templateProvider from './template_provider';
import errorPipeline from './error_pipeline';
import i18nDataProvider from './i18n';

const config = {};

const api = {
  setConfig: (cfg) => {
    Object.assign(config, cfg);
    i18nDataProvider.init(config.i18nApi, config.languageList);
  },
  middleware: (req, res, next) => {
    const url = req.url.split('?')[0];
    const options = {
      url,
      site: res.locals.site,
      siteLang: res.locals.lang,
      config: Object.assign({ admin: {}, client: {} }, config),
      logger: config.logger,
      claims: res.locals.claims,
      isNoCMSUser: res.locals.isNoCMSUser,
      authorizationHeader: res.locals.authorizationHeader,
      isLoggedIn: res.locals.isLoggedIn,
      runningEnvironment: config.environment,
      googleAnalyticsId: config.googleAnalyticsId,
      correlationId: req.get('x-correlation-id') || 'unknown',
      req,
      res,
      next,
    };
    if (req.query.pageId) {
      options.pageId = req.query.pageId;
      options.revision = req.query.rev;
    }

    if (req.headers.accept === 'application/json') {
      requestPipeline.init(options)
        .then(requestPipeline.fetchData)
        .then(requestPipeline.sendJsonResponse)
        .catch(errorPipeline);
      return;
    }

    requestPipeline.init(options)
      .then(requestPipeline.fetchI18nData)
      .then(requestPipeline.fetchData)
      .then(requestPipeline.fetchTemplate)
      .then(requestPipeline.renderPage)
      .then(requestPipeline.sendHtmlResponse)
      .catch(errorPipeline);
  },
  addDataSource: (pattern, fn) => {
    dataProvider.addDataSource(pattern, fn);
  },
  setAreas: (areas) => {
    templateProvider.setAreas(areas);
  },
  setTemplates: (templates) => {
    templateProvider.setTemplates(templates);
  },
};

export default api;
