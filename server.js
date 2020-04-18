import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import path from 'path';
import szkRoute from './routes/szavazokorok';
import scrapeRoute from './routes/scrape';
import kozigEgysegRoute from './routes/kozigegysegek-aggr';
import sourceHtmlRoute from './routes/sourcehtmls';
import urlsRoute from './routes/urls';
import vhuPageRoute from './routes/vhupage';
import usageRoute from './routes/usage';

dotenv.config()
const app =  express();

const corsOptions = {
  origin: '*',
  credentials: false
};

// Middlewares
app.use(bodyParser.json({limit: '50mb'}))
app.use(cors(corsOptions));

app.use('/', express.static(path.join(__dirname, 'apidoc')))
app.use('/vhupage', vhuPageRoute)

app.use('/szavazokorok', szkRoute)
app.use('/scrape', scrapeRoute)
app.use('/kozigegysegek', kozigEgysegRoute)
app.use('/sourcehtmls', sourceHtmlRoute)
app.use('/urls', urlsRoute)
app.use('/usage', usageRoute)


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
