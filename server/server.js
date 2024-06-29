import express, { json } from 'express';
import mongoose from 'mongoose'
import router from './routes/routes.js';
import config from './config/config.js';
import compression from 'compression';
import session from 'express-session';
const { PORT, HOST, database, dir } = config;

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
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
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

// handles routes
app.use('/', router);

// respond to unhandled routes
app.use('*', (req, res, next) => {
  if (req.accepts('html')) {
    res.status(404).render('404',{title: `404 Not Found`});
  } else if (res.accepts('json')) {
    res.status(404).json({error: `${req.originalUrl} not found`})
  } else {
    res.status(404).send('404 not Found');
  }
})

app.listen(PORT,HOST, () => {
  console.log(`Server listening at http://${HOST}:${PORT}`);
})
