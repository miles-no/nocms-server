import ajax from 'nocms-ajax';
import utils from 'nocms-utils';
import { triggerGlobal, listenToGlobal } from 'nocms-events';

import './link_click_handler';

const handleScroll = () => {
  utils.scrollTo(document.body, 0, 0);
};

const doNavigation = (pageData, url, options = {}) => {
  const {
    replaceState = false,
    keepScrollPosition = false,
  } = options;

  if (replaceState) {
    history.replaceState(pageData, pageData.pageTitle, url || pageData.uri);
  } else {
    history.pushState(pageData, pageData.pageTitle, url || pageData.uri);
  }

  if (!keepScrollPosition) {
    handleScroll();
  }

  document.title = pageData.pageTitle;
  triggerGlobal('nocms.pagedata-loaded', pageData);
  triggerGlobal('nocms.close-modal');
  triggerGlobal('track-event', 'navigation', window.location.pathname);
};

const handleResponse = (url, navigationOptions) => {
  return (err, response) => {
    if (err) {
      const errorPageData = {
        templateId: 'errorPage',
        exception: { statusCode: err.status },
        pageTitle: 'Vi kan ikke finne siden',
        uri: url,
        lang: response ? response.pageData.lang : 'no',
      };
      doNavigation(errorPageData, url, navigationOptions);
      triggerGlobal('page_not_found', url);
      return;
    }
    doNavigation(response.pageData, response.pageData.uri, navigationOptions);
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

listenToGlobal('navigate', (url, pageData, navigationOptions) => {
  if (pageData) {
    doNavigation(pageData, pageData.uri, navigationOptions);
    return;
  }
  ajax.get(url, handleResponse(url, navigationOptions));
});
