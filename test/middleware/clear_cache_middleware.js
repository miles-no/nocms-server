import test from 'ava';

const sut = require('../../src/middleware/clear_cache_middleware').default; // eslint-disable-line
import request from 'superagent'; // eslint-disable-line

import { res as resMock, req as reqMock, next } from './mocks'; // eslint-disable-line

let superagentMock;
let shouldVarnishFail = false;

test.before(() => {
  superagentMock = require('superagent-mock')(request, [{ pattern: '.*', ban: () => { return { status: 200, body: 'OK' }; }, fixtures: () => { if (shouldVarnishFail) { throw new Error(); } return 'OK'; }}]); // eslint-disable-line
});

test.after(() => {
  superagentMock.unset();
});

test('should call next if url is not /nocms/clear_entire_cache', (t) => {
  sut()(reqMock('/'), resMock(t, {}, { endTest: true }), next(t, { isCalled: true }));
});

test.cb('should return 403 forbidden if publisher claim is missing', (t) => {
  const res = resMock(t, { status: 403, response: 'Forbidden' }, { endTest: true });

  sut()(reqMock('/nocms/clear_entire_cache'), res, next(t, { isNotCalled: true }));
});

// callback tests seems to prevent test task from completing until timeout of about five seconds ends. Thus they are skipped
test.cb.skip('should return error status if request fails', (t) => {
  shouldVarnishFail = true;
  const expect = { status: 500, response: 'Internal server error' };
  const res = resMock(t, expect, { endTest: true, locals: { claims: { publisher: true } } });

  sut()(reqMock('/nocms/clear_entire_cache'), res, next(t, { isNotCalled: true }));
});

test.cb.skip('should send BAN request', (t) => {
  t.plan(2)
  shouldVarnishFail = false;
  const expect = { status: 200, response: 'Cache has been cleared' };
  const res = resMock(t, expect, { endTest: true, locals: { claims: { publisher: true } } });

  sut()(reqMock('/nocms/clear_entire_cache'), res, next(t, { isNotCalled: true }));
});
