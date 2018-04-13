import test from 'ava';
import { res as resMock, req as reqMock, next } from './mocks';

const clearRequire = require('clear-require');

const getSut = () => {
  clearRequire.all();
  const sut = require('../../src/middleware/prepare').default; // eslint-disable-line
  return sut;
};

test('should put verbose flag on res.locals', (t) => {
  const sut = getSut();
  const res = resMock();

  sut({ verbose: true, logger: console })(reqMock('/foo'), res, next(t, { isCalled: true }));
  t.true(res.locals.verbose);
});
