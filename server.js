import express from 'express';
import szkRoute from './routes/szavazokorok';
import szakaszRoute from './routes/szakaszok';
import scrapeRoute from './routes/scrape';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import authorization from './middlewares/authorization';
import kozigEgysegRoute from './routes/kozigegyseg';

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
app.use('/szakaszok', szakaszRoute)
app.use('/scrape', scrapeRoute)
app.use('/kozigegyseg', kozigEgysegRoute)
app.use('/telepules', kozigEgysegRoute)


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
