const logger = require('nocms-logger')();

module.exports = function errorHandler(err, req, res, next) {
  if (!err) {
    next();
    return;
  }
  logger.error('something went very wrong in nocms', err);
  res
    .status(500)
    .send('Internal server error') // @TODO: Output actual server error page
    .end();
};
