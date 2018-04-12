const domains = {};
const sites = [];
let defaultSite = {
  name: 'localhost',
  lang: 'en',
};

const api = {
  addSites: (addSites) => {
    addSites.forEach((s) => {
      const site = {
        name: s.name,
        lang: s.lang,
      };
      if (s.default) {
        defaultSite = site;
      }
      sites.push(Object.assign({}, s));
      s.domains.forEach((domain) => {
        domains[domain] = site;
      });
    });
  },
  getSites: () => {
    return sites;
  },
  getDomains: () => {
    return domains;
  },
  getDefault: () => {
    return defaultSite;
  },
  setDefaultSite: (name) => {
    const currentDefault = sites.find((s) => { return s.default; });
    if (currentDefault) {
      currentDefault.default = false;
    }

    const site = sites.find((s) => {
      return s.name === name;
    });
    site.default = true;
    defaultSite = Object.assign({}, site);
  },
  middleware: (config) => {
    return (req, res, next) => {
      res.locals.site = defaultSite.name;
      res.locals.lang = defaultSite.lang;

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
          res.locals.site = domains[key].name || defaultSite.name;
          res.locals.lang = domains[key].lang || defaultSite.lang;
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
