const api = {
  renderPage(nocms) {
    return new Promise((resolve, reject) => {
      if (nocms.verbose) {
        nocms.logger.debug('requestHandler: pageRenderer: Starting to render template');
      }
      try {
        nocms.html = nocms.renderTemplate();
      } catch (exception) {
        if (nocms.verbose) {
          nocms.logger.debug('requestHandler: pageRenderer: render failed', exception);
        }
        reject(exception);
        return;
      }

      if (nocms.verbose) {
        nocms.logger.debug('requestHandler: pageRenderer: output added to nocms.html');
      }
      resolve(nocms);
    });
  },
};

export default api;
