/** @type {import("express").RequestHandler} */
import path from "path";
import config from "../config/config.js";
import User from "../models/userModel.ts";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import {google } from 'googleapis';
import crypto from 'crypto';

export const authenticateUser = async (req:Request, res:Response, next:NextFunction) => {
  const { email, password } = req.body;

  try {
    // check if user with current email already exist in db
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "We couldn't find an account with that email address" });
      return;
    }

    // match the user password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    // create new user session
    req.session.regenerate((err:any) => {
      if (err) next(err);
      if (req.session.user) {
        req.session.user._id = user?._id;
      }
      // save the session
      req.session.save((err:any) => {
        if (err) next(err);
        res.redirect('/dashboard')
    
      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });

  }
};

// creates and saves new user to db
export const registerNewUser = async (req:Request, res:Response, next:NextFunction) => {
  const { email, password } = req.body;

  try {
    // check for duplicate user request
    const duplicateUser = await User.findOne({ email: email });
    if (duplicateUser) {
      return res.status(400).json({ error: `Email already registered` });
    }

    // create password hash
    const saltRounds = config.bcrypt.saltRounds;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // create new user
    const user = new User({
      email: email,
      passwordHash: passwordHash,
    });
    await user.save();

    // redirect to login
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const handleGoogleAuth = (req:Request, res:Response, next:NextFunction) => {
  const CLIENT_ID = config.Client.id;
  const CLIENT_SECRET = config.Client.secret;
  const REDIRECT_URI = config.Client.redirectUri;

  const oauth2Client = new google.auth.OAuth2({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
  });

  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ]
  
  // res.redirect('/dashboard')
}

// destroys the session and clears cookie and redirect to home page
export const logoutUser = (req:Request, res:Response,next:NextFunction) => {
  req.session.destroy((err:any) => {
    if (err) next(err);
    res.clearCookie(config.cookie.name)
    res.redirect('/')
  })
}


export const sendSignUpPage = (req:Request, res:Response) => {
  res.sendFile(path.join(config.dir.static, "src/pages/signup.html"));
};

export const sendLoginPage = (req:Request, res:Response) => {
  res.sendFile(path.join(config.dir.static, "src/pages/login.html"));
};
