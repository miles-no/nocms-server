import { triggerGlobal, listenToGlobal } from 'nocms-events';
import ajax from 'nocms-ajax';

const PageStore = class PageStore {
  constructor(config) {
    this.pageData = null;
    this.hasChanges = false;
    this.config = config;
  }

  getPageData() {
    return this.pageData;
  }

  startThrottler() {
    clearInterval(this.throttleId);
    this.throttleId = setInterval(this.persistChanges.bind(this), 2000);
  }

  stopThrottler() {
    clearInterval(this.throttleId);
    this.throttleId = null;
  }

  setPageData(pageData) {
    this.pageData = pageData;
    this.hasChanges = false;
  }

  setComponentData(componentData) {
    this.componentData = componentData;
  }

  loadDataFromHTML() {
    const pageDataElement = document.getElementById('nocms.pageData');
    if (pageDataElement) {
      this.pageData = JSON.parse(document.getElementById('nocms.pageData').innerHTML);
    }
  }

  updateScope(scope, value, doNotPublishChange) {
    const scopes = scope.split('.');
    const field = scopes.pop();
    let currentScope = this.pageData;
    scopes.forEach((scopePart) => {
      if (typeof currentScope[scopePart] === 'undefined') {
        currentScope[scopePart] = {};
      }
      currentScope = currentScope[scopePart];
    });
    currentScope[field] = value;
    if (!doNotPublishChange) {
      this.hasChanges = true;
    }
  }

  updateValues(pageValues) {
    this.pageData = Object.assign({}, this.pageData, pageValues);
    this.hasChanges = true;
  }

  persistChanges() {
    if (this.hasChanges) {
      const pageData = Object.assign({}, this.pageData);
      const pageDataWithoutComponentData = Object.assign({}, pageData);
      delete pageDataWithoutComponentData.componentData;
      const messageObj = {
        messageType: 'nocms-update-page',
        data: pageDataWithoutComponentData,
      };

      const options = {
        responseRequired: true,
      };
      ajax.post(this.config.messageApi, messageObj, options, (err) => {
        if (err) {
          triggerGlobal('nocms.error', 'Saving changes failed');
          return;
        }
        history.replaceState(pageData, pageData.title, window.location.pathname);
        triggerGlobal('nocms.page-saved', pageData);
        this.hasChanges = false;
      });
    }
  }
};

const api = {
  init(config) {
    this.store = new PageStore(config);
    this.store.loadDataFromHTML();

    listenToGlobal('nocms.pagedata-loaded', (pageData) => {
      this.store.setPageData(pageData);
      triggerGlobal('nocms.pagedata-updated', pageData);
    });
    listenToGlobal('nocms.value-changed', (scope, value) => {
      this.store.updateScope(scope, value);
      this.store.updateScope('hasUnpublishedChanges', true, true);
      const pageData = Object.assign({}, this.store.getPageData());
      triggerGlobal('nocms.pagedata-updated', pageData);
    });

    listenToGlobal('nocms.new-page-version', (pageId, revision) => {
      this.store.updateScope('pageId', pageId, true);
      this.store.updateScope('revision', revision, true);
      this.store.updateScope('hasUnpublishedChanges', false, true);
      const pageData = this.store.getPageData();
      triggerGlobal('nocms.pagedata-updated', pageData);
    });

    listenToGlobal('nocms.store-page-values', (pageValues) => {
      this.store.updateValues(pageValues);
      this.store.updateScope('hasUnpublishedChanges', true, true);

      const pageData = Object.assign({}, this.store.getPageData());
      triggerGlobal('nocms.pagedata-updated', pageData);
      this.store.persistChanges();
    });

    listenToGlobal('nocms.toggle-edit', (editMode) => {
      if (editMode) {
        this.store.startThrottler();
        return;
      }
      this.store.stopThrottler();
    });

    return this;
  },
  getPageData() {
    return this.store.getPageData();
  },
};

export default api;
