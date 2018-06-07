import { listenToGlobal, triggerGlobal } from 'nocms-events';

const navigateNatively = [];

const findClosest = (clickedEl, findFn) => {
  let current = clickedEl;
  while (current) {
    if (findFn(current)) {
      return current;
    }
    current = current.parentNode;
  }
  return false;
};

const checkIfLinkShouldBeHandledNatively = (clickedLink) => {
  const href = clickedLink.getAttribute('href');
  if (!href || clickedLink.classList.contains('native-nav')) {
    return true;
  }

  if (navigateNatively.indexOf(href) >= 0) {
    return true;
  }

  return false;
};

listenToGlobal('nocms.client-loaded', () => {
  navigateNatively.push(global.NoCMS.getConfig('publisherLoginUrl'));
  navigateNatively.push(global.NoCMS.getConfig('publisherLogoutUrl'));

  document.body.addEventListener('click', (e) => {
    const clickedLink = findClosest(e.target, (c) => { return c.nodeName === 'A'; });
    if (clickedLink) {
      if (findClosest(clickedLink, (c) => { return c.classList && c.classList.contains('edit-mode--active'); })) {
        e.preventDefault();
        return;
      }

      const href = clickedLink.getAttribute('href');

      if (checkIfLinkShouldBeHandledNatively(clickedLink)) {
        return;
      }

      if (href.indexOf('#') === 0) {
        e.preventDefault();

        const target = href.substring(1);
        triggerGlobal('navigate_in_page', target);
        triggerGlobal('track-event', 'navigation', 'in-page-navigation', window.location.pathname + href);
        return;
      }

      if (href.indexOf('://') === -1 && href.indexOf('mailto:') === -1 && href.indexOf('tel:') === -1) {
        e.preventDefault();
        triggerGlobal('navigate', href);
        // triggerGlobal('track-event', 'navigation', window.location.pathname);
      }
    }
  });
});
