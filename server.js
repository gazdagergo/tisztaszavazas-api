import express from 'express';
import devicesRoute from './routes/devices';
import actionsRoute from './routes/actions';
import homeRoute from './routes/home';
import iftttTestRoute from './routes/ifttttest';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import parse from './parse'

dotenv.config()
const app =  express();

const corsOptions = {
  origin: '*',
  credentials: false
};

// Middlewares
app.use(bodyParser.json())
app.use(cors(corsOptions));

// Routes
app.use('/devices', devicesRoute)
app.use('/actions', actionsRoute)
app.use('/ifttt', iftttTestRoute)
app.use('/', homeRoute)


// Connect to DB
/* mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
},
() => console.log('connected to DB')) */

// Listen
var port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`listening on ${port}`)
})

// start scrape
parse()