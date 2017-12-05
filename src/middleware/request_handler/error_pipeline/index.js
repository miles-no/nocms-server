import requestPipeline from '../pipeline';
import { dictionary } from '../i18n';

const titles = {
  404: dictionary('Siden finnes ikke'),
  500: dictionary('Det oppsto en feil'),
};

export default function nocmsErrorHandler(nocms) {
  if (nocms.redirect) {
    requestPipeline.sendRedirect(nocms);
    return;
  }
  const options = {
    url: nocms.url,
    config: nocms.config,
    site: nocms.site,
    logger: nocms.logger,
    isNoCMSUser: nocms.res.locals.isNoCMSUser,
    authorizationToken: nocms.res.locals.authorizationToken,
    isLoggedIn: nocms.res.locals.isLoggedIn,
    runningEnvironment: nocms.config.environment,
    googleAnalyticsId: nocms.config.googleAnalyticsId,
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
    delete options.pageData.templateId;
    delete options.pageData.pageTitle;
    requestPipeline.init(options)
      .then(requestPipeline.sendJsonResponse)
      .catch(nocms.next);
    return;
  }

  requestPipeline.init(options)
    .then(requestPipeline.fetchTemplate)
    .then(requestPipeline.renderPage)
    .then(requestPipeline.sendHtmlResponse)
    .catch(nocms.next);
}
