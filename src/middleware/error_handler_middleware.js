
const config = {};

module.exports = {
  middleware: (err, req, res, next) => {
    if (!err) {
      next();
      return;
    }
    config.logger.error('something went very wrong in nocms', err);
    res
      .status(500)
      .send('Internal server error') // @TODO: Output actual server error page
      .end();
  },
  setConfig: (cfg) => {
    Object.assign(config, cfg);
  },
};
