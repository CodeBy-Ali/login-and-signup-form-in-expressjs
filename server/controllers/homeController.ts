import path from 'path';
import config from '../config/config.js';
import { Request, RequestHandler, Response } from 'express';

export const sendHomePage = (req:Request, res:Response) => {
  res.sendFile(path.join(config.dir.static, 'index.html'));
}