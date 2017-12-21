const domains = {};
const defaults = {
  name: 'localhost',
  lang: 'en',
};

const api = {
  addSites: (sites) => {
    sites.forEach((s) => {
      s.domains.forEach((domain) => {
        domains[domain] = {
          name: s.name,
          lang: s.lang,
        };
      });
    });
  },
  setDefaults: (name, lang) => {
    defaults.name = name;
    defaults.lang = lang;
  },
  middleware: (config) => {
    return (req, res, next) => {
      res.locals.site = defaults.name;
      res.locals.lang = defaults.lang;

      if (!req.headers.host) {
        if (res.locals.verbose) {
          config.logger.debug('siteResolver: Not host header found. Using default', { site: res.locals.site, lang: res.locals.lang });
        }
        next();
        return;
      }

      const m = req.headers.host.match(/^([^/]+)/);
      if (m) {
        const key = m[1];
        if (domains[key]) {
          res.locals.site = domains[key].name || defaults.name;
          res.locals.lang = domains[key].lang || defaults.lang;
        }
        if (res.locals.verbose) {
          config.logger.debug('siteResolver: ', { site: res.locals.site, lang: res.locals.lang });
        }
      }
      next();
    };
  },
};


export default api;
