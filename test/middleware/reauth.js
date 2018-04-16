import test from 'ava';
import { res as resMock, req as reqMock, next } from '../mocks';

const clearRequire = require('clear-require');

const getSut = () => {
  clearRequire.all();
  const sut = require('../../src/middleware/reauth').default; // eslint-disable-line
  return sut;
};

test('should respond with location header if token expired flag is set', (t) => {
  const sut = getSut();
  const expect = { status: 307, callEnd: true, append: ['Location', '/api/login/refresh?returnTo=/foo'] };

  sut(reqMock('/foo'), resMock(t, expect, { locals: { tokenExpired: true }}), next(t, { isNotCalled: true }));
});

test('should call next if token not expired flag is set', (t) => {
  const sut = getSut();

  sut(reqMock('/'), resMock(), next(t, { isCalled: true }));
});
