import test from 'ava';
import { res as resMock, req as reqMock, next } from './mocks';

const clearRequire = require('clear-require');

const getSut = () => {
  clearRequire.all();
  const sut = require('../../src/middleware/error_handler_middleware').default; // eslint-disable-line
  return sut;
};

test('should call next if there is no error', (t) => {
  const sut = getSut();
  sut.middleware(null, reqMock('/'), resMock(), next(t, { isCalled: true }));
});

test('should send error response', (t) => {
  t.plan(2);
  const sut = getSut();
  const expect = { status: 404, response: '404 Not Found' };
  sut.middleware({ status: 404, message: 'Not Found' }, reqMock('/'), resMock(t, expect), next(t, { isCalled: true }));
});
