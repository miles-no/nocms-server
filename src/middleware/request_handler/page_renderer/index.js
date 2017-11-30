module.exports = {
  renderPage(nocms) {
    return new Promise((resolve) => {
      nocms.html = nocms.renderTemplate();
      resolve(nocms);
    });
  },
};
