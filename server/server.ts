import express, { json } from 'express';
import mongoose from 'mongoose'
import router from './routes/routes.ts';
import config from './config/config.ts';
import compression from 'compression';
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import MongoStore from 'connect-mongo';
import errorHandler from './middlewares/errorHandler.js';
const { PORT, HOST, database, dir, sessionSecret,cookie } = config;


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
      _id: mongoose.Types.ObjectId;
    }
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

// logRequest
app.use((req, res, next) => {
  // req.session.reload((err) => next(err));
  console.log("\n----------------------------------------------\n")
  console.log(req.session);
  console.log(`--> SessionId: ${req.sessionID}`);
  console.log("\n----------------------------------------------")
  next();
})

// handles routes
app.use('/', router);

// server static assets
app.use(express.static(dir.static));

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
