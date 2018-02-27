import request from 'superagent';

let phrases = null;
const config = {};

const fetchData = (nocms, resolve) => {
  if (config.verbose) {
    config.logger.debug(`i18n: Fetching data. Initiated by ${resolve ? 'request' : 'interval'}`);
  }
  request
    .get(`${config.i18nApi}/phrases`)
    .set('Accept', 'application/json')
    .set('x-correlation-id', nocms ? nocms.correlationId : null) // TODO: Should we have a correlationId here instead of null?
    .end((err, res) => {
      if (err) {
        if (config.verbose) {
          config.logger.debug('i18n: Fetching data failed', err);
        }
        if (resolve) {
          resolve({});
        }
        return;
      }
      phrases = {};
      if (config.verbose) {
        config.logger.debug('i18n: Fetching data succeeded');
      }
      if (res.body instanceof Array) {
        res.body.forEach((item) => {
          const phrase = {};
          config.languageList.forEach((lang) => {
            phrase[lang] = item[lang];
          });
          phrases[item.key] = phrase;
        });
      }
      if (resolve) {
        resolve(phrases);
      }
    });
};

const api = {
  init(cfg) {
    Object.assign(config, { i18nApi: cfg.i18nApi, languageList: cfg.languageList, verbse: cfg.verbose, logger: cfg.logger });
    fetchData();
    setInterval(fetchData, 60000);
  },
  getPhrases(nocms) {
    return new Promise((resolve) => {
      if (phrases) {
        if (config.verbose) {
          config.logger.debug('i18n: Resolving with cached phrases');
        }
        resolve(phrases);
        return;
      }
      fetchData(nocms, resolve);
    });
  },
  dictionary(phraseKey, lang) {
    if (phrases === null || !phrases[phraseKey] || !phrases[phraseKey][lang]) {
      return phraseKey;
    }

    return phrases[phraseKey][lang];
  },
};

export default api;
