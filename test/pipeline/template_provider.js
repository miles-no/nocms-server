import test from 'ava';
import React from 'react';
import Template from '../Template';

const clearRequire = require('clear-require');

const somePageData = {
  templateId: 'example',
  pageTitle: 'test',
};

const someNocmsObj = {
  config: { admin: {}, pageConfig: {}, client: {} },
  logger: console,
  pageData: somePageData,
};

const someTemplates = [
  {
    id: 'example',
    component: Template,
  },
];

const getSut = () => {
  clearRequire.all();
  const sut = require('../../src/middleware/request_handler/template_provider').default; // eslint-disable-line
  return sut;
};

test.cb('should put the renderTemplate function on nocms', (t) => {
  const sut = getSut();
  sut.setTemplates(someTemplates);
  sut
    .fetchTemplate({})
    .then((result) => {
      t.is(typeof result.renderTemplate, 'function');
      t.end();
    })
    .catch((ex) => {
      t.fail('Template provider threw an exception');
      t.log(ex);
      t.end();
    });
});

test.cb('renderTemplate function should output html', (t) => {
  const sut = getSut();  
  sut.setTemplates(someTemplates);
  sut
    .fetchTemplate(someNocmsObj)
    .then((result) => {
      const html = result.renderTemplate();
      t.true(html.indexOf('thisContentIsUniqueInTheDOMOutput') >= 0);
      t.end();
    })
    .catch((ex) => {
      t.fail('Template provider threw an exception');
      t.log(ex);
      t.end();
    });
});

test.serial.cb('should output areas', (t) => {
  const sut = getSut();

  const areas = {
    headContent: <p>head-content-area</p>,
    topContent: <p>top-content-area</p>,
    bottomContent: <p>bottom-content-area</p>,
    script: <p>script-area</p>,
  };
  sut.setAreas(areas);
  sut.setTemplates(someTemplates);

  sut
    .fetchTemplate(someNocmsObj)
    .then((result) => {
      const html = result.renderTemplate();
      t.true(html.indexOf('head-content-area') >= 0);
      t.true(html.indexOf('top-content-area') >= 0);
      t.true(html.indexOf('bottom-content-area') >= 0);
      t.true(html.indexOf('script-area') >= 0);
      t.end();
    })
    .catch((ex) => {
      t.fail('Template provider threw an exception');
      t.log(ex);
      t.end();
    });
});

test.serial.cb('should invoke area functions', (t) => {
  const sut = getSut();

  const areas = {
    topContent: (pageData) => {
      t.is(pageData.pageTitle, 'test');
      return <p>top-content-area-from-function</p>;
    },
  };

  sut.setAreas(areas);
  sut.setTemplates(someTemplates);

  sut
    .fetchTemplate(someNocmsObj)
    .then((result) => {
      const html = result.renderTemplate();
      t.true(html.indexOf('top-content-area-from-function') >= 0);
      t.end();
    })
    .catch((ex) => {
      t.fail('Template provider threw an exception');
      t.log(ex);
      t.end();
    });
});

test('should render exception', (t) => {
  const sut = getSut();

  const nocms = {
    config: someNocmsObj.config,
    logger: someNocmsObj.logger,
    url: '/i-will-throw',
    exception: {
      statusCode: 404,
    },
    siteLang: 'en',
  };
  sut.setTemplates([
    {
      id: 'errorPage',
      component: Template,
    },
  ]);

  const html = sut.renderException(nocms);
  t.true(html.indexOf('"templateId":"errorPage","statusCode":"404","uri":"/i-will-throw"') >= 0);
});
