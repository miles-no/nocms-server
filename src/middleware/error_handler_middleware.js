const config = {};

const api = {
  middleware: (err, req, res, next) => {
    if (!err) {
      next();
      return;
    }
    if (config.logger) {
      config.logger.error('something went very wrong in nocms', err);
    }
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    res
      .status(status)
      .send(`${status} ${message}`); // @TODO: Output actual server error page
  },
  setConfig: (cfg) => {
    Object.assign(config, cfg);
  },
};

export default api;
