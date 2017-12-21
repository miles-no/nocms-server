const request = require('superagent');

export default function clearCacheMiddleware(config) {
  return (req, res, next) => {
    if (req.url === '/nocms/clear_entire_cache') {
      if (!(res.locals.claims && res.locals.claims.publisher)) {
        res.status(403).send('Forbidden');
        return;
      }
      if (res.locals.verbose) {
        config.logger.debug('clearCacheMiddleware: Clearing entire cache');
      }
      request('BAN', 'http://varnish').end((e) => { // TODO: This should come from config
        if (e) {
          if (res.locals.verbose) {
            config.logger.debug('clearCacheMiddleware: Clearing cache failed', e);
          }
          res.status(500).send('Internal server error');
          return;
        }
        if (res.locals.verbose) {
          config.logger.debug('clearCacheMiddleware: Clearing cache succeeded');
        }
        res.status(200).send('Cache has been cleared');
      });
      return;
    }
    next();
  };
}
