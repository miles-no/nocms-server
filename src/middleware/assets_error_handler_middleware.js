const config = {};

const api = {
  middleware: (err, req, res, next) => {
    if (!err) {
      next();
      return;
    }

    if (config.verbose) {
      config.logger.info('assets error', { url: req.originalUrl, code: err.code, status: err.status });
    }
    if (err.status !== 404) {
      config.logger.error(`Error serving asset on url ${req.originalUrl}`, err);
    } else {
      config.logger.info(`Asset not found: ${req.originalUrl}`);
    }
    res
      .status(err.status || 500)
      .send(err.status === 404 ? 'Not found' : 'Internal server error')
      .end();
  },
  setConfig: (cfg) => {
    Object.assign(config, cfg);
  },
};

export default api;
