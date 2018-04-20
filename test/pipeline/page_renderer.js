import test from 'ava';

const sut = require('../../src/middleware/request_handler/page_renderer').default; // eslint-disable-line

test.cb('should execute rendering and put result on nocms.html', (t) => {
  t.plan(2);
  const nocms = {
    renderTemplate: () => {
      t.pass('render template was called');
      return 'ok';
    },
  };

  sut
    .renderPage(nocms)
    .then((result) => {
      t.is(result.html, 'ok');
      t.end();
    })
    .catch((ex) => {
      t.fail('Page rendererer threw an exception');
      t.log(ex);
      t.end();
    });
});

test.cb('should reject if renderTemplate function throws', (t) => {
  t.plan(1);
  const nocms = {
    renderTemplate: () => {
      throw new Error('endering failed');
    },
  };
  sut
    .renderPage(nocms)
    .then(() => {
      t.fail('should be rejected');
      t.end();
    })
    .catch((ex) => {
      t.pass();
      t.end();
    });
});
