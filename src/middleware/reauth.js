
export default function reauth(req, res, next) {
  if (res.locals.tokenExpired) {
    res.append('Location', `/api/login/refresh?returnTo=${req.url}`).status(307).end();
    return;
  }
  next();
}
