const config = {};

const api = {
  middleware: (err, req, res, next) => {
    if (!err) {
      next();
      return;
    }
    config.logger.error('something went very wrong in nocms'); // TODO Logger must take multiple arguments
    config.logger.error(err);
    res
      .status(500)
      .send('Internal server error') // @TODO: Output actual server error page
      .end();
  },
  setConfig: (cfg) => {
    Object.assign(config, cfg);
  },
};

export default api;
