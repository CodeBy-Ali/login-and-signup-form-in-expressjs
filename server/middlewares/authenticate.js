import session from "express-session";



export const isAuthenticated = (req, res, next) => {
  console.log(req.session)
  if (req.session.user) next();
  else res.redirect('/register');
}