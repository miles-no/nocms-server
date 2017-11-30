const request = require('superagent');
const config = require('nocms-config-client').get();
const logger = require('nocms-logger')();

let phrases = null;

const fetchData = (nocms, resolve, reject) => {
  logger.debug('Fetching i18n data');
  request
    .get(`${config.i18nApi}/phrases`)
    .set('Accept', 'application/json')
    .set('x-correlation-id', nocms ? nocms.correlationId : null) // TODO: Should we have a correlationId here?
    .end((err, res) => {
      if (reject && err) {
        reject(err);
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

fetchData();

setInterval(fetchData, 60000);

module.exports = {
  getPhrases(nocms) {
    return new Promise((resolve, reject) => {
      if (phrases) {
        resolve(phrases);
        return;
      }
      fetchData(nocms, resolve, reject);
    });
  },
};
