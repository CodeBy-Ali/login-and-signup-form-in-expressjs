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
    static: path.resolve(__dirname, '..', '../client/dist') + sep
  },

  database: process.env.MONGODB_URI || "mongodb://localhost:27017/test",
}

export default config;