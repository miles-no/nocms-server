export default function prepareRequest(config) {
  return (req, res, next) => {
    res.locals.verbose = config.verbose;
    if (res.locals.verbose) {
      config.logger.debug('Preparing request', { url: req.url, correlationId: req.correlationId() });
    }
    next();
  };
}
