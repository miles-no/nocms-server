let redirects = [];

const api = {
  addRedirects: (newRedirects) => {
    redirects = redirects.concat(newRedirects);
  },
  addRedirect: (from, to) => {
    redirects = redirects.concat({ from, to });
  },
  middleware: (req, res, next) => {
    const url = req.url;
    const match = redirects.find((el) => { return el.from === url; });
    if (match) {
      res.append('Location', match.to).status(301).end();
      return;
    }
    next();
  },
};

export default api;
