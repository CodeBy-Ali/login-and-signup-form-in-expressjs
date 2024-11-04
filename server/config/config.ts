import dotenv from "dotenv";
import path, { sep } from "path";



//TODO create separate configs for each node environment
type Env = "testing" | "development" | "production";
const ENV: Env = (process.env.NODE_ENV as Env|undefined) || "development";
const __dirname = import.meta.dirname;
const envPath = path.resolve(
  __dirname,
  ENV === "production" ? "../../.env" : "../.env"
);
dotenv.config({ path: envPath });

interface Config {
  port: number;
  host: string;
  dir: {
    root: string;
    static: string;
    views: string;
  };
  Client: {
    id: string;
    secret: string;
    redirectUri: string;
    scopes: string[];
  };
  database: string;
  bcrypt: {
    saltRounds: number;
  };
  sessionSecret: string;
  cookie: {
    name: string;
    maxAge: number;
  };
  env: Env;
}


console.log(ENV);
const config: Config = {
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || `127.0.0.1`,
  dir: {
    root: __dirname,
    static:
      path.resolve(
        __dirname,
        ENV === "production" ? "../../../client/dist" : "../../client/dist"
      ) + sep,
    views:
      path.resolve(
        __dirname,
        ENV === "production" ? "../../views" : "../views"
      ) + sep,
  },
  Client: {
    id: process.env.CLIENT_ID as string,
    secret: process.env.CLIENT_SECRET as string,
    redirectUri: process.env.REDIRECT_URI as string,
    scopes: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  },
  database: process.env.MONGODB_URI || "mongodb://localhost:27017/test",
  bcrypt: {
    saltRounds: 10,
  },
  sessionSecret: process.env.SESSION_SECRET || "thisIsASecretToNotDisclose",
  cookie: {
    name: "sessionId",
    maxAge: 5 * 60 * 1000, // 5 minutes
  },
  env: (process.env.NODE_ENV as Env) || "development",
};

export default config;
