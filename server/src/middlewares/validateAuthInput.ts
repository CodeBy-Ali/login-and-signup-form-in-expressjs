import { NextFunction, Request, Response } from "express";

const isEmailValid = (email:string) => /^(?!.*\.\.)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

const isPasswordValid = (password:string) => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}/.test(password);

const validateAuthInput = (req:Request, res:Response, next:NextFunction) => {
  const { email, password } = req.body;

  let message = "";

  if (!email || !isEmailValid(email)) {
    message += "Invalid email";
  }

  if (!password || !isPasswordValid(password)) {
    message += " Invalid password";
  }

  if (message.length > 0) {
    res.status(400).json({ message });
  }

  next();
};

export default validateAuthInput;
