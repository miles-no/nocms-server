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
    pattern: '.*',
    get: (match, data) => {
      return { status: 200, body: data };
    },
    fixtures: (match, params, headers, context) => {
      return {
        uri: '/test',
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

test.cb('should apply pageData on nocms object', (t) => {
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
      t.deepEqual(result.pageData, { uri: nocms.url });
      t.end();
    })
    .catch((ex) => {
      t.fail('Exception was thrown');
      t.log(ex);
      t.end();
    });
});
