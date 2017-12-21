import requestPipeline from './pipeline';
import dataProvider from './data_provider';
import templateProvider from './template_provider';
import errorPipeline from './error_pipeline';
import i18nDataProvider from './i18n';

const config = {};

const api = {
  setConfig: (cfg) => {
    Object.assign(config, cfg);
    i18nDataProvider.init(config);
  },
  middleware: (req, res, next) => {
    if (res.locals.verbose) {
      config.logger.debug('requestHandler: Initializing request', { url: req.url, correlationId: req.correlationId(), json: req.headers.accept === 'application/json' });
    }

    const url = req.url.split('?')[0];
    const options = {
      url,
      site: res.locals.site,
      siteLang: res.locals.lang,
      config: Object.assign({
        admin: {},
        client: {},
        pageConfig: {
          clientAppScript: config.clientAppScript,
          adminAppScript: config.adminAppScript,
          adminAppCss: config.adminAppCss,
          mainCss: config.mainCss,
          includeMainCss: config.includeMainCss,
        },
      }, config),
      logger: config.logger,
      claims: res.locals.claims,
      isNoCMSUser: res.locals.isNoCMSUser,
      authorizationHeader: res.locals.authorizationHeader,
      isLoggedIn: res.locals.isLoggedIn,
      runningEnvironment: config.environment,
      googleAnalyticsId: config.googleAnalyticsId,
      correlationId: req.get('x-correlation-id') || 'unknown',
      verbose: config.verbose,
      req,
      res,
      next,
    };

    if (req.query.pageId) {
      options.pageId = req.query.pageId;
      options.revision = req.query.rev;
    }

    if (req.headers.accept === 'application/json') {
      if (res.locals.verbose) {
        config.logger.debug('requestHandler: Running json pipeline');
      }
      requestPipeline.init(options)
        .then(requestPipeline.fetchData)
        .then(requestPipeline.sendJsonResponse)
        .catch(errorPipeline);
      return;
    }
    if (res.locals.verbose) {
      config.logger.debug('requestHandler: Running html pipeline');
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
