import test from 'ava';
import { res as resMock, req as reqMock, next } from '../mocks';

const clearRequire = require('clear-require');

const getSut = () => {
  clearRequire.all();
  const sut = require('../../src/middleware/redirects').default; // eslint-disable-line
  return sut;
};

test('should respond with location header when matching redirect rule', (t) => {
  const sut = getSut();
  const expect = { status: 301, callEnd: true, append: ['Location', '/bar'] };

  sut.addRedirect('/foo', '/bar');
  sut.middleware()(reqMock('/foo'), resMock(t, expect), next(t, { isNotCalled: true }));
});

test('should call next if not matching any redirect', (t) => {
  const sut = getSut();

  sut.addRedirect('/foo', '/bar');
  sut.middleware()(reqMock('/bar'), resMock(), next(t, { isCalled: true }));
});

test('should handle adding of multiple redirects', (t) => {
  const sut = getSut();
  const expect = { status: 301, callEnd: true };

  sut.addRedirects([{ from: '/foo', to: '/bar' }, { from: '/test', to: '/redirected-test' }]);
  sut.middleware()(reqMock('/foo'), resMock(t, expect), next(t, { isNotCalled: true }));
  sut.middleware()(reqMock('/test'), resMock(t, expect), next(t, { isNotCalled: true }));
  sut.middleware()(reqMock('/not-redirected'), resMock(), next(t, { isCalled: true }));
});
