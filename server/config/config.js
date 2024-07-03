import dotenv from 'dotenv'
import path, { sep } from 'path';


const __dirname = import.meta.dirname;
const envPath = path.resolve(__dirname, '../.env')
dotenv.config({ path: envPath });

const config = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || `127.0.0.1`,
  dir: {
    root: __dirname,
    static: path.resolve(__dirname, '..', '../client/public') + sep,
    views: path.resolve(__dirname, '../views') + sep,
  },
  database: process.env.MONGODB_URI || "mongodb://localhost:27017/test",
  bcrypt: {
    saltRounds: 10,
  },
  sessionSecret: process.env.SESSION_SECRET,
  cookie: {
    name: "sessionId",
    maxAge: 5 * 60 * 1000, // 5 minutes
  }
  
}

export default config;