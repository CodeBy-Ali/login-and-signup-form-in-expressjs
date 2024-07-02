/** @type {import("express").RequestHandler} */
import path from "path";
import config from "../config/config.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import session from "express-session";

//
export const authenticateUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // check if user with current email already exist in db
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "We couldn't find an account with that email address" });
      return;
    }

    // match the user password
    console.log(user.passwordHash,password)
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    // create new user session
    req.session.regenerate((err) => {
      if (err) next(err);
      req.session.user = user?._id.toString();
      // save the session
      req.session.save((err) => {
        if (err) next(err);
        console.log(req.session.user)
        // redirect to dashboard page
        res.redirect('/dashboard')
    
      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });

  }
};

// creates and saves new user to db
export const registerNewUser = async (req, res, next) => {
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
    res.redirect("login");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendSignUpPage = (req, res) => {
  res.sendFile(path.join(config.dir.static, "src/pages/signup.html"));
};

export const sendLoginPage = (req, res) => {
  res.sendFile(path.join(config.dir.static, "src/pages/login.html"));
};
