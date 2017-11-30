const request = require('superagent');

module.exports = function clearCacheMiddleware(req, res, next) {
  if (req.url === '/nocms/clear_entire_cache') {
    if (!(res.locals.claims && res.locals.claims.publisher)) {
      res.status(403).send('Forbidden');
      return;
    }
    request('BAN', 'http://varnish').end((e) => {
      if (e) {
        res.status(500).send(e);
        return;
      }
      res.status(200).send('Cache has been cleared');
    });
    return;
  }
  next();
};
