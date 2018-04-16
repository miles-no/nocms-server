import test from 'ava';
import { res as resMock, req as reqMock, next } from '../mocks';

const clearRequire = require('clear-require');

const getSut = () => {
  clearRequire.all();
  const sut = require('../../src/middleware/error_handler_middleware').default; // eslint-disable-line
  return sut;
};

const getConfig = () => {
  return {
    logger: {
      info: () => {},
      error: () => {},
    },
  };
};

test('should call next if there is no error', (t) => {
  const sut = getSut();
  sut.setConfig(getConfig());
  sut.middleware(null, reqMock('/'), resMock(), next(t, { isCalled: true }));
});

test('should send error response', (t) => {
  const sut = getSut();
  sut.setConfig(getConfig());
  const expect = { status: 404, response: '404 Not Found' };
  sut.middleware({ status: 404, message: 'Not Found' }, reqMock('/'), resMock(t, expect));
});

test('should default to "500 Internal server error" if status is not specified', (t) => {
  const sut = getSut();
  sut.setConfig(getConfig());
  const expect = { status: 500, response: '500 Internal server error' };
  sut.middleware({}, reqMock('/'), resMock(t, expect));
});

test('should log 404 assets to info level', (t) => {
  const config = getConfig();
  config.logger.info = t.pass;
  config.logger.error = t.fail;

  const sut = getSut();
  sut.setConfig(config);

  sut.middleware({ status: 404, message: 'Not Found' }, reqMock('/'), resMock());
});

test('should log other errors to error level', (t) => {
  const config = getConfig();
  config.logger.info = t.fail;
  config.logger.error = t.pass;

  const sut = getSut();
  sut.setConfig(config);

  sut.middleware({}, reqMock('/'), resMock());
});
