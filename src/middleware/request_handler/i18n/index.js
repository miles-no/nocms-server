import ServiceDataProvider from './service_data_provider';

export const init = ServiceDataProvider.init;
export const dictionary = ServiceDataProvider.dictionary;
const fetchI18nData = (nocms) => {
  if (nocms.config.verbose) {
    nocms.logger.debug('i18n: Initializing fetch');
  }
  return new Promise((resolve) => {
    ServiceDataProvider.getPhrases(nocms)
      .then((i18n) => {
        nocms.i18n = i18n;
        resolve(nocms);
      })
      .catch((err) => {
        nocms.logger.info('Could not load i18n data. Proceeding with default', err);
        nocms.i18n = {};
        resolve(nocms);
      });
  });
};

export default {
  init: ServiceDataProvider.init,
  dictionary: ServiceDataProvider.dictionary,
  fetchI18nData,
};
