// Redirect urls with trailing /

export default function redirectTrailingSlashRequestsMiddleware(req, res, next) {
  const url = req.url.split('?')[0];

  if (url !== '/' && url[url.length - 1] === '/') {
    res.append('Location', url.substring(0, url.length - 1)).status(301).end();
    return;
  }
  next();
}