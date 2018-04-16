import test from 'ava';
import sut from '../../src/middleware/robots_txt';
import { res as resMock, req as reqMock } from '../mocks';

test('should return 404 if /robots.txt are missing', (t) => {
  const expect = { status: 404, callEnd: true };

  sut.middleware(reqMock('https://foo/robots.txt'), resMock(t, expect));
});

test('should throw if file can not be read', (t) => {
  const error = t.throws(() => {
    sut.addRobotsTxt('thisRobotsTxtDoesNotExist.txt');
  });
  t.true(error instanceof Error, 'Unexisting file did not throw an exception');
});

test('should return robots.txt if it is set', (t) => {
  const expect = {
    status: 200,
    response: 'robots.txt content',
    append: ['Content-Type', 'text/plain'],
  };

  sut.addRobotsTxt('test/static/robots.txt');
  sut.middleware(reqMock('https://foo/robots.txt'), resMock(t, expect));
});
