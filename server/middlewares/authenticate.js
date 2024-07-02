
// checks if matching userId is present in the session store
export const isAuthenticated = (req, res, next) => {
  if (req.session.user) next();
  else res.redirect('/register');
}

export const redirectIfAuthorized = (req, res, next) => {
  console.log(req.session)
  if (!req.session.user) next();
  else res.redirect('/dashboard');
}