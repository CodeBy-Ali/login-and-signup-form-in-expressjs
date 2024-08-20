
// checks if matching userId is present in the session store
export const isAuthenticated = (req, res, next) => {
  if (req.session.user)  next();
  res.redirect('/login')
}

export const redirectIfAuthorized = (req, res, next) => {
  if (!req.session.user) next();
  else res.redirect('/dashboard');
}