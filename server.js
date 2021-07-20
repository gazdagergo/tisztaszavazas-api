import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import path from 'path';
import szkRoute from './routes/szavazokorok';
import kozigEgysegRoute from './routes/kozigegysegek-aggr';
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
app.use('/kozigegysegek', kozigEgysegRoute)
app.use('/szavazokorok', szkRoute)
app.use('/usage', usageRoute)
app.use('/vhupage', vhuPageRoute)


// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
},
() => console.log('connected to DB'))

// Listen
var port = process.env.PORT || 1338;
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
