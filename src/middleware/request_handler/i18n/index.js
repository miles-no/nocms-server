import ServiceDataProvider from './service_data_provider';

export const init = ServiceDataProvider.init;
export const dictionary = ServiceDataProvider.dictionary;
export function fetchI18nData(nocms) {
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
}
