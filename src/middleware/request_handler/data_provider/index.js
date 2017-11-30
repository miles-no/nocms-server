const ServiceDataProvider = require('./service_data_provider');
const UrlPattern = require('url-pattern');

const dataSources = [];

const addDefaultPageData = function addDefaultPageData(pageData) {
  // const pageDataWithDefault = pageData;
  // const defaultPageData = DefaultPageDataProvider.getForTemplate(pageData.templateId, pageData.lang);
  // Object.keys(defaultPageData).forEach((key) => {
  // if (typeof pageDataWithDefault[key] === 'undefined') {
  //    pageDataWithDefault[key] = defaultPageData[key];
  //  }
  // });
  return pageData;
};

const applyException = (nocms, err) => {
  nocms.exception = {
    statusCode: err.status || 500,
    message: err.text || 'Internal server error',
    url: err.url,
  };
  return nocms;
};

const applyPageData = (nocms, res) => {
  if (!!res.movedTo && !(nocms.pageId && nocms.revision)) {
    nocms.exception = {
      statusCode: 301,
      message: `The page has moved to ${res.movedTo}`,
      location: res.movedTo,
    };
    nocms.redirect = res.movedTo;
  } else {
    nocms.pageData = addDefaultPageData(res);
  }
  return nocms;
};

const getCustomDataSource = (nocms) => {
  return dataSources.find((d) => {
    return d.pattern.match(nocms.url) !== null;
  });
};

module.exports = {
  fetchData(nocms) {
    return new Promise((resolve, reject) => {
      const dataSource = getCustomDataSource(nocms);
      if (dataSource) {
        dataSource.fn(nocms)
          .then((res) => { resolve(res); })
          .catch((err) => {
            reject(applyException(nocms, err));
          });
        return;
      }
      if (nocms.pageId) {
        ServiceDataProvider.getPageDataByPageId(nocms)
          .then((res) => {
            resolve(applyPageData(nocms, res));
          })
          .catch((err) => {
            reject(applyException(nocms, err));
          });
      } else {
        ServiceDataProvider.getPageDataByUrl(nocms)
          .then((res) => {
            resolve(applyPageData(nocms, res));
          })
          .catch((err) => {
            reject(applyException(nocms, err));
          });
      }
    });
  },
  addDataSource(pattern, fn) {
    const dataSourcePattern = typeof pattern === 'string' ? new UrlPattern(pattern) : pattern;
    dataSources.push({ pattern: dataSourcePattern, fn });
  },
};
