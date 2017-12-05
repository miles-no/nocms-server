const api = {
  renderPage(nocms) {
    return new Promise((resolve) => {
      nocms.html = nocms.renderTemplate();
      resolve(nocms);
    });
  },
};

export default api;
