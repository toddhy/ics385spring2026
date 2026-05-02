function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // For API requests, return 401. For page requests, redirect.
  if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.redirect('/admin/login');
}

export default isAuthenticated;
