const request = require('superagent');
const config = require('nocms-config-client').get();

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

module.exports = {
  getPageDataByUrl(nocms) {
    const site = nocms.site;
    return new Promise((resolve, reject) => {
      request
        .get(config.pageService)
        .query({ uri: nocms.url, site })
        .set('Authorization', nocms.authorizationHeader ? nocms.authorizationHeader : '')
        .set('x-correlation-id', nocms.correlationId)
        .end(handleResponse(nocms.url, resolve, reject));
    });
  },
  getPageDataByPageId(nocms) {
    const pageId = nocms.pageId;

    return new Promise((resolve, reject) => {
      request
        .get(`${config.pageService}/page`)
        .query({
          pageId,
          rev: nocms.revision,
        })
        .set('Authorization', nocms.authorizationHeader ? nocms.authorizationHeader : '')
        .set('x-correlation-id', nocms.correlationId)
        .end(handleResponse(`/?pageId=${nocms.pageId}&rev=${nocms.revision}`, resolve, reject));
    });
  },
};
