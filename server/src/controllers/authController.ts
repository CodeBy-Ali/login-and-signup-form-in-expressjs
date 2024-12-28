/** @type {import("express").RequestHandler} */
import path from "path";
import config from "../config/config.js";
import User, { IUser } from "../models/userModel.js";
import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { oauth2Client } from "../server.js";
import { google } from "googleapis";
import mongoose from "mongoose";
import QueryString from "qs";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    // check if user with current email already exist in db
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(404)
        .json({ error: "We couldn't find an account with that email address" });
      return;
    }

    // match the user password
    if (!user.passwordHash || user.authMethod == "google") {
      return res.status(400).send({
        error: "Use google account to log in",
      });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).json({ error: "Incorrect password" });
    }
    // create new user session
    await createUserSession(user._id, req);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// creates and saves new user to db
export const registerNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      authMethod: "local",
    });
    await user.save();

    // redirect to login
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleGoogleAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const state = crypto.randomBytes(32).toString("hex");
  req.session.state = state;

  const authorizedUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: config.Client.scopes,
    include_granted_scopes: true,
    state: state,
  });
  res.redirect(authorizedUrl);
};

export const handleGoogleAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, code } = validateOAuth2Query(
    req.query as oauth2CallbackQuery,
    req.session.state
  );
  if (!code) {
    console.error(error);
    return res.redirect("/login");
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const auth2 = google.oauth2({
      version: "v2",
      auth: oauth2Client,
    });
    const { data } = await auth2.userinfo.get();
    const userData = extractUserData(data as UserData, "google");
    const user =
      (await User.findOne({ email: data.email })) || new User(userData);
    await user.save();

    // create user session
    await createUserSession(user._id, req);
    res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }
};

// destroys the session and clears cookie and redirect to home page
export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err: any) => {
    if (err) next(err);
    res.clearCookie(config.cookie.name);
    res.redirect("/");
  });
};

export const sendSignUpPage = (req: Request, res: Response) => {
  res.sendFile(path.join(config.dir.static, "src/pages/signup.html"));
};

export const sendLoginPage = (req: Request, res: Response) => {
  res.sendFile(path.join(config.dir.static, "src/pages/login.html"));
};

// helper functions

interface UserData {
  email: string;
  password: string;
  picture?: string;
  id?: string;
  name?: string;
}

function extractUserData(data: UserData, authMethod: string): IUser {
  if (authMethod === "local")
    return {
      email: data.email,
      passwordHash: data.password,
      authMethod,
    };
  return {
    email: data.email,
    passwordHash: data.password,
    profilePicture: data.picture,
    authMethod,
    googleId: data.id,
    name: data.name,
  };
}

function createUserSession(
  userId: mongoose.Types.ObjectId,
  req: Request
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) reject(err);

      req.session.user = {
        id: userId,
        isLoggedIn: true,
      };

      req.session.save((err) => {
        if (err) reject(err);
        resolve("User session created successfully");
      });
    });
  });
}

interface oauth2CallbackQuery extends QueryString.ParsedQs {
  error?: string;
  code?: string;
  state: string;
}

function validateOAuth2Query(
  query: oauth2CallbackQuery,
  sessionState: string | undefined
) {
  if (query.error) {
    return {
      error: "Google Oauth2 callback error: Missing or invalid code.",
    };
  }
  if (query.state !== sessionState) {
    return {
      error: "State mismatch. Possible CSRF attack",
    };
  }
  if (!query.code || !(typeof query.code === "string")) {
    return {
      error: "Google Oauth2 callback error: Missing or invalid code.",
    };
  }

  return {
    code: query.code,
  };
}
