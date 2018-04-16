import test from 'ava';
import { res as resMock, req as reqMock, next } from '../mocks';

const clearRequire = require('clear-require');

const getSut = () => {
  clearRequire.all();
  const sut = require('../../src/middleware/redirect_trailing_slash_requests_middleware').default; // eslint-disable-line
  return sut;
};

test('should redirect requests with trailing slashes', (t) => {
  const sut = getSut();
  const expect = { status: 301, callEnd: true, append: ['Location', '/foo'] };

  sut()(reqMock('/foo/'), resMock(t, expect), next(t, { isNotCalled: true }));
});

test('should call next if uri has no trailing slash', (t) => {
  const sut = getSut();

  sut()(reqMock('/foo'), resMock(), next(t, { isCalled: true }));
});
