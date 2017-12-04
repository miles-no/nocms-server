const ServiceDataProvider = require('./service_data_provider');

module.exports = {
  init: ServiceDataProvider.init,
  dictionary: ServiceDataProvider.dictionary,
  fetchI18nData(nocms) {
    return new Promise((resolve) => {
      ServiceDataProvider.getPhrases(nocms)
        .then((i18n) => {
          nocms.i18n = i18n;
          resolve(nocms);
        })
        .catch((err) => {
          nocms.logger.error('Could not load i18n data. Proceeding with default', err);
          nocms.i18n = {};
          resolve(nocms);
        });
    });
  },
};
