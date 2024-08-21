import { Request,Response,NextFunction } from "express";

// checks if matching userId is present in the session store
export const isAuthenticated = (req:Request, res:Response, next:NextFunction) => {
  if (req.session.user?.isLoggedIn) return  next();
  res.redirect('/login')
}

export const redirectIfAuthorized = (req:Request, res:Response, next:NextFunction) => {
  if (!req.session.user?.isLoggedIn) next();
  else res.redirect('/dashboard');
}

