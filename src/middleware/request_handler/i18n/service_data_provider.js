import request from 'superagent';

let phrases = null;
const config = {};

const fetchData = (nocms, resolve, reject) => {
  request
    .get(`${config.i18nApi}/phrases`)
    .set('Accept', 'application/json')
    .set('x-correlation-id', nocms ? nocms.correlationId : null) // TODO: Should we have a correlationId here?
    .end((err, res) => {
      if (err) {
        if (reject) {
          reject(err);
        }
        return;
      }
      phrases = {};
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
        resolve(JSON.parse(phrases));
      }
    });
};

const api = {
  init(i18nApi, languageList) {
    Object.assign(config, { i18nApi, languageList });
    fetchData();
    setInterval(fetchData, 60000);
  },
  getPhrases(nocms) {
    return new Promise((resolve, reject) => {
      if (phrases) {
        resolve(phrases);
        return;
      }
      fetchData(nocms, resolve, reject);
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
