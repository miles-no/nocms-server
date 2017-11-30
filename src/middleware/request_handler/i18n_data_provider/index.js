const logger = require('nocms-logger')();
const ServiceDataProvider = require('./service_data_provider');
const dictionary = require('../../../../src/nocms/dictionary/dictionary');

module.exports = {
  fetchI18nData(nocms) {
    return new Promise((resolve) => {
      ServiceDataProvider.getPhrases(nocms)
        .then((i18n) => {
          nocms.i18n = Object.assign(dictionary, i18n);
          resolve(nocms);
        })
        .catch((err) => {
          logger.error('Could not load i18n data. Proceeding with default', err);
          nocms.i18n = dictionary;
          resolve(nocms);
        });
    });
  },
};
