const domains = {};
const defaults = {
  name: 'localhost',
  lang: 'en',
};

module.exports = {
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
  middleware: (req, res, next) => {
    res.locals.site = defaults.name;
    res.locals.lang = defaults.lang;

    if (!req.headers.host) {
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
    }
    next();
  },
};
