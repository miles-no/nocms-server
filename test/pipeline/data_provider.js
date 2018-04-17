import test from 'ava';

import request from 'superagent'; // eslint-disable-line
const sut = require('../../src/middleware/request_handler/data_provider').default; // eslint-disable-line

import { res as resMock, req as reqMock, next } from '../mocks'; // eslint-disable-line

let superagentMock;

const config = {
  pageService: 'http://page-service',
};

const mockConfig = [
  {
    pattern: 'http://page-service(.*)',
    get: (match, data) => {
      return { status: 200, body: data };
    },
    fixtures: (match) => {
      if (match[1] === '?uri=%2Fthis-will-fail&site=en') {
        throw new Error();
      }
      if (match[1] === '/page?pageId=123-moved') {
        return {
          uri: '/i-am-moved',
          movedTo: '/moved-to-here',
          requestedUrl: match ? match[0] : '',
        };
      }
      if (match[1] === '?uri=%2Fi-am-moved&site=en') {
        return {
          uri: '/i-am-moved',
          movedTo: '/moved-to-here',
          requestedUrl: match ? match[0] : '',
        };
      }
      return {
        uri: '/test',
        requestedUrl: match ? match[0] : '',
      };
    },
  },
];

test.before(() => {
  superagentMock = require('superagent-mock')(request, mockConfig); // eslint-disable-line
});

test.after(() => {
  superagentMock.unset();
});

test.cb('should apply pageData from page service on nocms object', (t) => {
  const nocms = {
    logger: console,
    url: '/test',
    config,
    site: 'en',
    correlationId: '123',
  };

  sut
    .fetchData(nocms)
    .then((result) => {
      t.deepEqual(result.pageData, { uri: nocms.url, requestedUrl: 'http://page-service?uri=%2Ftest&site=en' });
      t.end();
    })
    .catch((ex) => {
      t.fail('Exception was thrown');
      t.log(ex);
      t.end();
    });
});

test.cb('should apply page data from custom data source', (t) => {
  const nocms = {
    logger: console,
    url: '/custom',
    config,
    site: 'en',
    correlationId: '123',
  };

  const pageData = { uri: '/custom', templateId: 'foo' };
  sut.addDataSource('/custom', (nocmsObj) => {
    return new Promise((resolve) => {
      nocmsObj.pageData = pageData;
      resolve(nocms);
    });
  });

  sut
    .fetchData(nocms)
    .then((result) => {
      t.deepEqual(result.pageData, pageData);
      t.end();
    })
    .catch((ex) => {
      t.fail('Exception was thrown');
      t.log(ex);
      t.end();
    });
});

test.cb('should get page data by id if it is set', (t) => {
  const nocms = {
    logger: console,
    pageId: '123',
    config,
    site: 'en',
    correlationId: '123',
  };

  sut
    .fetchData(nocms)
    .then((result) => {
      t.deepEqual(result.pageData, { uri: '/test', requestedUrl: 'http://page-service/page?pageId=123' });
      t.end();
    })
    .catch((ex) => {
      t.fail('Exception was thrown');
      t.log(ex);
      t.end();
    });
});

test.cb('should set exception field if page has been moved', (t) => {
  const nocms = {
    logger: console,
    url: '/i-am-moved',
    config,
    site: 'en',
    correlationId: '123',
  };

  sut
    .fetchData(nocms)
    .then((result) => {
      t.falsy(result.pageData);
      t.is(result.redirect, '/moved-to-here');
      t.is(result.exception.statusCode, 301);
      t.is(result.exception.location, '/moved-to-here');
      t.end();
    })
    .catch((result) => {
      t.log(result);
      t.fail('Shold not throw');
      t.end();
    });
});

test.cb('should not set exception field if page is requested by id', (t) => {
  const nocms = {
    logger: console,
    pageId: '123-moved',
    config,
    site: 'en',
    correlationId: '123',
  };

  sut
    .fetchData(nocms)
    .then((result) => {
      t.falsy(result.exception);
      t.truthy(result.pageData);
      t.falsy(result.redirect);
      t.is(result.pageData.movedTo, '/moved-to-here');
      t.is(result.pageData.uri, '/i-am-moved');
      t.end();
    })
    .catch((result) => {
      t.log(result);
      t.fail('Shold not throw');
      t.end();
    });
});

test.cb('should set exception field if request fails', (t) => {
  const nocms = {
    logger: console,
    url: '/this-will-fail',
    config,
    site: 'en',
    correlationId: '123',
  };

  sut
    .fetchData(nocms)
    .then((result) => {
      t.fail('The request shoul throw');
      t.end();
    })
    .catch((result) => {
      t.truthy(result.exception);
      t.falsy(result.pageData);
      t.is(result.exception.statusCode, 500);
      t.end();
    });
});
