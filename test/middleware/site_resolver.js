import test from 'ava';
import { res as resMock, req as reqMock, next } from './mocks';

const clearRequire = require('clear-require');

const getSut = () => {
  clearRequire.all();
  const sut = require('../../src/middleware/site_resolver').default; // eslint-disable-line
  return sut;
};

test('should default to english language on localhost', (t) => {
  const sut = getSut();
  t.deepEqual(sut.getDefault(), { lang: 'en', name: 'localhost' });
});

test('should support adding sites', (t) => {
  const sut = getSut();

  const sites = [{ name: 'test', lang: 'no', domains: ['test'] }];
  sut.addSites(sites);

  const siteResult = sut.getSites();
  t.is(siteResult.length, 1, 'Site length is not correct');

  const site = siteResult[0];
  t.is(site.name, 'test');
  t.is(site.lang, 'no');
});

test('should support create hashmap of domains', (t) => {
  const sut = getSut();
  const sites = [{ name: 'test', lang: 'no', domains: ['test1', 'test2'] }];
  sut.addSites(sites);
  const domains = sut.getDomains();

  const expected = { 
    test1: { name: 'test', lang: 'no' },
    test2: { name: 'test', lang: 'no' },
  };

  t.deepEqual(domains, expected);
});

test('when adding sites multiple times', (t) => {
  const sut = getSut();

  const site1 = { name: 'test-1', lang: 'no', domains: ['test-1'] };
  const site2 = { name: 'test-2', lang: 'no', domains: ['test-2'] };

  sut.addSites([site1]);
  sut.addSites([site2]);

  const siteResult = sut.getSites();
  t.is(siteResult.length, 2, 'Site length is not correct');

  const s1 = siteResult[0];
  t.is(s1.name, 'test-1');
  t.is(s1.lang, 'no');
  t.is(s1.domains[0], 'test-1');

  const s2 = siteResult[1];
  t.is(s2.name, 'test-2');
  t.is(s2.lang, 'no');
  t.is(s2.domains[0], 'test-2');
});

test('sites with default flag should override default site', (t) => {
  const sut = getSut();
  const site = { name: 'my-default-site', lang: 'no', default: true, domains: ['test'] };
  sut.addSites([site]);

  const defaultSite = sut.getDefault();
  t.is(defaultSite.lang, 'no');
  t.is(defaultSite.name, 'my-default-site');
});


test('setting default site', (t) => {
  const sut = getSut();
  const site = { name: 'my-default-site', lang: 'no', default: false, domains: ['test'] };
  sut.addSites([site]);

  sut.setDefaultSite('my-default-site');

  const defaultSite = sut.getDefault();
  t.is(defaultSite.lang, 'no');
  t.is(defaultSite.name, 'my-default-site');
});

test('middleware should apply default site', (t) => {
  t.plan(3);  
  const sut = getSut();
  const res = resMock();
  sut.addSites([{ name: 'test', lang: 'no', default: true, domains: ['test'] }]);

  sut.middleware()(reqMock('https://example.com'), res, next(t, { isCalledWithoutError: true }));
  t.is(res.locals.site, 'test');
  t.is(res.locals.lang, 'no');
});

test('middleware should return site based on host', (t) => {
  t.plan(5);
  const sut = getSut();
  const res = resMock();
  sut.addSites([{ name: 'test-1', lang: 'no', domains: ['bar'] }, { name: 'test-2', lang: 'en', domains: ['example.com'] }]);

  sut.middleware()(reqMock('https://example.com/about-us'), res, next());
  t.is(res.locals.site, 'test-2');
  t.is(res.locals.lang, 'en');

  sut.middleware()(reqMock('https://bar'), res, next(t, { isCalledWithoutError: true }));
  t.is(res.locals.site, 'test-1');
  t.is(res.locals.lang, 'no');
});
