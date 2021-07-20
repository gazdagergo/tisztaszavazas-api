import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import authorization from './middlewares/authorization';
import szkRoute from './routes/szavazokorok';
import kozteruletRoute from './routes/kozteruletek';
import scrapeRoute from './routes/scrape';
import kozigEgysegRoute from './routes/kozigegyseg';
import sourceHtmlRoute from './routes/sourcehtmls';
import urlsRoute from './routes/urls';

dotenv.config()
const app =  express();

const corsOptions = {
  origin: '*',
  credentials: false
};

// Middlewares
app.use(bodyParser.json({limit: '50mb'}))
app.use(cors(corsOptions));
app.use(authorization);


// Routes
app.use('/szavazokorok', szkRoute)
app.use('/kozteruletek', kozteruletRoute)
app.use('/scrape', scrapeRoute)
app.use('/kozigegyseg', kozigEgysegRoute)
app.use('/telepules', kozigEgysegRoute)
app.use('/sourcehtmls', sourceHtmlRoute)
app.use('/urls', urlsRoute)


// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
},
() => console.log('connected to DB'))

// Listen
var port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
