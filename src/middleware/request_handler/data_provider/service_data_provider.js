import request from 'superagent';

const handleResponse = (url, resolve, reject) => {
  const requestedUrl = url;
  return (err, res) => {
    if (err) {
      reject(Object.assign({ url: requestedUrl }, err));
      return;
    }
    resolve(res.body);
  };
};

export function getPageDataByUrl(nocms) {
  const site = nocms.site;
  return new Promise((resolve, reject) => {
    const data = { uri: nocms.url, site };
    if (nocms.verbose) {
      nocms.logger.debug(`requestHandler: page data provider fetching page as ${nocms.authorizationHeader ? 'user' : 'guest'} from ${nocms.config.pageService} with query data`, data);
    }

    request
      .get(nocms.config.pageService)
      .query(data)
      .set('Authorization', nocms.authorizationHeader ? nocms.authorizationHeader : '')
      .set('x-correlation-id', nocms.correlationId)
      .end(handleResponse(nocms.url, resolve, reject));
  });
}

export function getPageDataByPageId(nocms) {
  const pageId = nocms.pageId;
  return new Promise((resolve, reject) => {
    const data = {
      pageId,
    };
    if (nocms.verbose) {
      nocms.logger.debug(`requestHandler: page data provider fetching page as ${nocms.authorizationHeader ? 'user' : 'guest'} from ${nocms.config.pageService} with query data`, data);
    }

    request
      .get(`${nocms.config.pageService}/page`)
      .query(data)
      .set('Authorization', nocms.authorizationHeader ? nocms.authorizationHeader : '')
      .set('x-correlation-id', nocms.correlationId)
      .end(handleResponse(`/?pageId=${nocms.pageId}&rev=${nocms.revision}`, resolve, reject));
  });
}
