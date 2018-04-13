const config = {};

const api = {
  middleware: (err, req, res, next) => {
    if (!err) {
      next();
      return;
    }

    const status = err.status || 500;
    const message = err.message || 'Internal server error';

    if (status === 404) {
      config.logger.info(`404: ${req.url} refered from ${req.get('Referer') || '"unknown"'}`, { url: req.url, originalUrl: req.originalUrl, referrer: req.get('Referer') });
    } else {
      config.logger.error(`${status}: ${req.url} Error`, err);
    }

    res
      .status(status)
      .send(`${status} ${message}`); // @TODO: Output actual server error page
  },
  setConfig: (cfg) => {
    Object.assign(config, cfg);
  },
};

export default api;
