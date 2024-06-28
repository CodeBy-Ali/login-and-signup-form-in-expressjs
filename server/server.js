import express, { json } from 'express';
import mongoose from 'mongoose'
import router from './routes/routes.js';
import config from './config/config.js';

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

// parse req body
app.use(express.json())

// server static assets
app.use(express.static(dir.static));

// handles routes
app.use('/', router);


app.listen(PORT,HOST, () => {
  console.log(`Server listening at http://${HOST}:${PORT}`);
})
