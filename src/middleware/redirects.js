let redirects = [];

const api = {
  addRedirects: (newRedirects) => {
    redirects = redirects.concat(newRedirects);
  },
  addRedirect: (from, to) => {
    redirects = redirects.concat({ from, to });
  },
  middleware: (config) => {
    return (req, res, next) => {
      const url = req.url;
      const match = redirects.find((el) => { return el.from === url; });
      if (match) {
        if (res.locals.verbose) {
          config.logger.debug(`redirectsMiddleware: Redirecting from ${url} to ${match.to}. Ending request`);
        }
        res.append('Location', match.to).status(301).end();
        return;
      }
      next();
    };
  },
};

export default api;
