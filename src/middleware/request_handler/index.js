const config = require('nocms-config-client').get();
const requestPipeline = require('./pipeline');
const dataProvider = require('./data_provider');
const templateProvider = require('./template_provider');
const errorPipeline = require('./error_pipeline');

module.exports = {
  middleware: (req, res, next) => {
    const url = req.url.split('?')[0];
    const options = {
      url,
      site: res.locals.site,
      siteLang: res.locals.lang,
      config,
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
