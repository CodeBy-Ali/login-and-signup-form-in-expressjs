import path from 'path';
import config from '../config/config.js';

export const renderDashboardView = (req, res) => {
  res.status(200).sendFile(path.resolve(config.dir.static, 'src/pages/dashboard.html'));  
}