import { NextFunction, Request, Response } from "express";
import config from "../config/config.js";

const testRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code } = req.query;
  try {
    const isCodeValid = code === config.apiTestSecret;
    if (!isCodeValid) {
      return res.status(404).render("404", { title: `404 Not Found` });
    }
    res.status(200).send({
      status: "success",
      message: "Server is live",
    });
  } catch (err: unknown) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export default testRequestHandler;
