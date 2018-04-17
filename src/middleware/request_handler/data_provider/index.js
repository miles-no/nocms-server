import UrlPattern from 'url-pattern';
import { getPageDataByPageId, getPageDataByUrl } from './service_data_provider';

const dataSources = [];

const applyException = (nocms, err) => {
  const ex = {
    statusCode: err.status || 500,
    message: err.text || 'Internal server error',
    url: err.url,
  };
  nocms.logger.error('Page data provider exception', ex, nocms, err);
  nocms.exception = ex;
  return nocms;
};

const applyPageData = (nocms, res) => {
  if (res.movedTo && !nocms.pageId) {
    if (nocms.verbose) {
      nocms.logger.debug(`requesthandler: Page moved to ${res.movedTo}`);
    }
    nocms.exception = {
      statusCode: 301,
      message: `The page has moved to ${res.movedTo}`,
      location: res.movedTo,
    };
    nocms.redirect = res.movedTo;
  } else {
    if (nocms.verbose) {
      nocms.logger.debug('requesthandler: Applying page data', res);
    }
    nocms.pageData = res;
  }
  return nocms;
};

const getCustomDataSource = (nocms) => {
  return dataSources.find((d) => {
    return d.pattern.match(nocms.url) !== null;
  });
};

const fetchData = (nocms) => {
  return new Promise((resolve, reject) => {
    const dataSource = getCustomDataSource(nocms);
    if (dataSource) {
      if (nocms.verbose) {
        nocms.logger.debug(`requestHandler: using custom data source for ${nocms.url}`);
      }
      dataSource.fn(nocms)
        .then((res) => {
          if (nocms.verbose) {
            nocms.logger.debug('requestHandler: got data from custom data source', res.pageData);
          }
          resolve(res);
        })
        .catch((err) => {
          if (nocms.verbose) {
            nocms.logger.debug('requestHandler: custom data source fetch failed');
          }
          reject(applyException(nocms, err));
        });
      return;
    }
    if (nocms.pageId) {
      getPageDataByPageId(nocms)
        .then((res) => {
          if (nocms.verbose) {
            nocms.logger.debug('requestHandler: got page data from page service by id', res);
          }
          resolve(applyPageData(nocms, res));
        })
        .catch((err) => {
          if (nocms.verbose) {
            nocms.logger.debug('requestHandler: fetching page data failed', err);
          }
          reject(applyException(nocms, err));
        });
    } else {
      getPageDataByUrl(nocms)
        .then((res) => {
          if (nocms.verbose) {
            nocms.logger.debug('requestHandler: got page data from page service by url', res);
          }
          resolve(applyPageData(nocms, res));
        })
        .catch((err) => {
          if (nocms.verbose) {
            nocms.logger.debug('requestHandler: fetching page data failed', err);
          }
          reject(applyException(nocms, err));
        });
    }
  });
};

const addDataSource = (pattern, fn) => {
  if (typeof pattern !== 'string') {
    throw new Error('Invalid pattern. Must be string');
  }
  dataSources.push({ pattern: new UrlPattern(pattern), fn });
};

export default {
  fetchData,
  addDataSource,
};
