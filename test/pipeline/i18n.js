import test from 'ava';

import request from 'superagent'; // eslint-disable-line
const sut = require('../../src/middleware/request_handler/i18n').default; // eslint-disable-line

import { res as resMock, req as reqMock, next } from '../mocks'; // eslint-disable-line

let superagentMock;
let serviceShouldFail = false;
const mockConfig = [
  {
    pattern: '(.*)',
    get: (match, data) => {
      return { status: 200, body: data };
    },
    fixtures: () => {
      if (serviceShouldFail) {
        throw new Error();
      }
      return [
        {
          key: 'foo',
          en: 'foo-en',
          no: 'foo-no',
        },
      ];
    },
  },
];

test.before(() => {
  superagentMock = require('superagent-mock')(request, mockConfig); // eslint-disable-line
});

test.after(() => {
  superagentMock.unset();
});

test.cb('should fetch data', (t) => {
  serviceShouldFail = false;
  sut.init({
    i18nApi: 'http://i18n',
    languageList: ['en', 'no'],
    doNotFetchOnInit: true,
    doNotFetchRegularly: true,
    logger: console,
  });

  sut
    .fetchI18nData({ config: {}, correlationId: '123' })
    .then((result) => {
      t.truthy(result.i18n);
      t.is(result.i18n.foo.no, 'foo-no');
      t.is(result.i18n.foo.en, 'foo-en');
      t.end();
    })
    .catch(() => {
      t.fail('should not throw');
      t.end();
    });
});

test.cb('should not throw exception if service fails, but return empty object', (t) => {
  serviceShouldFail = true;
  sut.init({
    i18nApi: 'http://i18n',
    languageList: ['en', 'no'],
    doNotFetchOnInit: true,
    doNotFetchRegularly: true,
    logger: console,
  });

  sut
    .fetchI18nData({ config: {}, correlationId: '123' })
    .then((result) => {
      t.truthy(result.i18n);
      t.deepEqual(result.i18n, {});
      t.end();
    })
    .catch(() => {
      t.fail('should not throw');
      t.end();
    });
});
