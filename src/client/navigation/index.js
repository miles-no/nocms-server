import request from 'superagent';
import { triggerGlobal, listenToGlobal } from 'nocms-events';
import utils from 'nocms-utils';

import './link_click_handler';

const handleScroll = () => {
  utils.scrollTo(document.body, 0, 400);
};

const doNavigation = (pageData) => {
  history.pushState(pageData, pageData.pageTitle, pageData.uri);
  document.title = pageData.pageTitle;
  if (!pageData.appRootUrl) {
    // Scroll to top when pageload, but not for office clicks on /sosialt and /menneskene
    handleScroll();
  }
  triggerGlobal('nocms.pagedata-loaded', pageData);
  triggerGlobal('nocms.close-modal');
};

const handleResponse = (url) => {
  return (err, response) => {
    if (err) {
      const errorPageData = {
        templateId: 'errorPage',
        exception: { statusCode: err.status },
        pageTitle: 'Vi kan ikke finne siden',
        uri: url,
        lang: response ? response.body.pageData.lang : 'no',
      };
      doNavigation(errorPageData);
      triggerGlobal('page_not_found', url);
      return;
    }
    const responseData = JSON.parse(response.text);
    doNavigation(responseData.pageData);
  };
};

window.addEventListener('popstate', (event) => {
  triggerGlobal('close-modal');
  if (event.state) {
    triggerGlobal('nocms.pagedata-loaded', event.state);
  }
});

listenToGlobal('nocms.client-loaded', (uri, pageData) => {
  history.replaceState(pageData, pageData.pageTitle, window.location.pathname + window.location.search);
});

listenToGlobal('navigate', (url, pageData) => {
  if (pageData) {
    doNavigation(pageData);
    return;
  }
  request.get(url)
    .set('Accept', 'application/json')
    .end(handleResponse(url));
});
