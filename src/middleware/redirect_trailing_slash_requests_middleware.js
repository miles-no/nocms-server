// Redirect urls with trailing /

export default function redirectTrailingSlashRequestsMiddleware(config) {
  return (req, res, next) => {
    const url = req.url.split('?')[0];

    if (url !== '/' && url[url.length - 1] === '/') {
      const target = url.substring(0, url.length - 1);
      if (res.locals.verbose) {
        config.logger.debug(`redirectTrailingSlashRequestsMiddleware: Redirecting from ${url} to ${target}. Ending request`);
      }
      res.append('Location', target).status(301).end();
      return;
    }
    next();
  };
}
