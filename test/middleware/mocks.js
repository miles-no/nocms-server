
export function res(test, expectations) {
  let expect = expectations || {};
  let t = test;
  const api = {
    status: (status) => {
      if (t && expect.status) {
        t.is(status, expect.status, 'Invalid status code');
      }
      return api;
    },
    end: () => {
      if (expect.callEnd) {
        t.pass();
      }
    },
    append: (name, value) => {
      if (expect.append) {
        t.true(expect.append[0] === name && expect.append[1] === value);
      }
      return api;
    },
    send: (content) => {
      if (expect.response) {
        t.is(content, expect.response, 'Response content failed');
      }
    },
    locals: {},
  };
  return api;
}

export function req(urlParam, options = {}) {
  const parts = urlParam.match(/:\/\/([^\/]+)(\/.*|$)/);
  let url = '/';
  let host;

  if (parts) {
    url = parts[2];
    host = parts[1];
  } else {
    url = urlParam;
  }

  const headers = Object.assign({ host }, options.headers);
  return {
    headers,
    url: url || '/',
  };
}

export function next(t, verifications = {}) {
  return (err) => {
    if (t) {
      if (verifications.isCalled) {
        t.pass();
      }
      if (verifications.isNotCalled) {
        t.fail('next should not be called');
      }
      if (verifications.isCalledWithError) {
        t.truthy(err, 'Next is called without error');
      }
      if (verifications.isCalledWithoutError) {
        t.falsy(err);
      }
    }
  };
}
