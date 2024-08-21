import express, { json } from 'express';
import mongoose from 'mongoose'
import requestLogger from './middlewares/requestLogger.ts';
import router from './routes/routes.ts';
import config from './config/config.ts';
import compression from 'compression';
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import MongoStore from 'connect-mongo';
import { google } from 'googleapis';
import errorHandler from './middlewares/errorHandler.js';
const { PORT, HOST, database, dir, sessionSecret,cookie } = config;






// set up oauth client
export const oauth2Client = new google.auth.OAuth2({
  clientId: config.Client.id,
  clientSecret:  config.Client.secret,
  redirectUri: config.Client.redirectUri,
});



// connect to database
mongoose.connect(database)
.then(() => console.log('Connected to database'))
.catch (err => {
  console.log(err);
  process.exit(1);
})

// create express app
const app = express();

// creating sessions

declare module 'express-session' {
  interface SessionData{
    user: {
      id: mongoose.Types.ObjectId;
      isLoggedIn: boolean;
    },
    state: string,
  }
}
app.use(session({
  name: cookie.name,
  secret: sessionSecret,
  store: MongoStore.create({
    mongoUrl: database,
  }),
  resave: false,
  saveUninitialized: false,
  genid: () => uuidv4(),
  cookie: {
    maxAge: cookie.maxAge,
    httpOnly: false,
  }
}))


// use ejs template engine
app.set('view engine', 'ejs');
app.set('views', dir.views);

// don't identify express
app.disable('x-powered-by');

// compress http res
app.use(compression());

// parse req body
app.use(express.json())


// server static assets
app.use(express.static(dir.static));

// logRequest
app.use(requestLogger);

// handles routes
app.use('/', router);

// respond to unhandled routes
app.use('*', (req, res, next) => {
  if (req.accepts('html')) {
    res.status(404).render('404',{title: `404 Not Found`});
  } else if (req.accepts('json')) {
    res.status(404).json({error: `${req.originalUrl} not found`})
  } else {
    res.status(404).send('404 not Found');
  }
})
// handler error
app.use(errorHandler);

app.listen(PORT,HOST, () => {
  console.log(`Server listening at http://${HOST}:${PORT}`);
})
