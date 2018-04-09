import requestPipeline from '../pipeline';
import { dictionary } from '../i18n';

const titles = {
  404: dictionary('Siden finnes ikke'),
  500: dictionary('Det oppsto en feil'),
};

export default function nocmsErrorHandler(nocms) {
  if (nocms.verbose) {
    nocms.logger.debug('requestHandler: initiating error pipeline');
  }
  if (nocms.redirect) {
    requestPipeline.sendRedirect(nocms);
    return;
  }
  const locals = nocms.res ? nocms.res.locals || {} : {};
  const config = nocms.config || {};
  const options = {
    url: nocms.url,
    config: nocms.config,
    site: nocms.site,
    logger: nocms.logger,
    claims: locals.claims,
    isNoCMSUser: locals.isNoCMSUser,
    authorizationToken: locals.authorizationToken,
    isLoggedIn: locals.isLoggedIn,
    runningEnvironment: config.environment,
    googleAnalyticsId: config.googleAnalyticsId,
    correlationId: nocms.req ? nocms.req.get('x-correlation-id') : 'unknown',
    verbose: config.verbose,
    req: nocms.req,
    res: nocms.res,
  };

  options.pageData = {
    templateId: 'errorPage',
    statusCode: nocms.exception.statusCode.toString(),
    uri: nocms.url,
    pageTitle: titles[nocms.exception.statusCode.toString()] || dictionary('Det oppsto en feil'),
    lang: nocms.siteLang,
  };
  options.statusCode = nocms.exception.statusCode;

  if (nocms.req.headers.accept === 'application/json') {
    if (nocms.verbose) {
      nocms.logger.debug('requestHandler: error pipeline sending json response');
    }
    delete options.pageData.templateId;
    delete options.pageData.pageTitle;
    requestPipeline.init(options)
      .then(requestPipeline.sendJsonResponse)
      .catch(nocms.next);
    return;
  }

  if (nocms.verbose) {
    nocms.logger.debug('requestHandler: error pipeline sending html response');
  }

  requestPipeline.init(options)
    .then(requestPipeline.fetchI18nData)
    .then(requestPipeline.fetchTemplate)
    .then(requestPipeline.renderPage)
    .then(requestPipeline.sendHtmlResponse)
    .catch(nocms.next);
}
