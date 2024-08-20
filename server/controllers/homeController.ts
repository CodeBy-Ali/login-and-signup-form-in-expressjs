import path from 'path';
import config from '../config/config.js';

export const sendHomePage = (req, res) => {
  res.sendFile(path.join(config.dir.static, 'index.html'));
}