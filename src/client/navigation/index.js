import ajax from 'nocms-ajax';
import utils from 'nocms-utils';
import { triggerGlobal, listenToGlobal } from 'nocms-events';

import './link_click_handler';

const handleScroll = () => {
  utils.scrollTo(document.body, 0, 0);
};

const doNavigation = (pageData, url) => {
  history.pushState(pageData, pageData.pageTitle, url || pageData.uri);
  document.title = pageData.pageTitle;
  handleScroll();
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
        lang: response ? response.pageData.lang : 'no',
      };
      doNavigation(errorPageData, url);
      triggerGlobal('page_not_found', url);
      return;
    }
    doNavigation(response.pageData, url);
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
    doNavigation(pageData, url);
    return;
  }
  ajax.get(url, handleResponse(url));
});
