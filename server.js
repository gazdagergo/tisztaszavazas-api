const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const path = require('path')
const szkRoute = require('./routes/szavazokorok')
const kozigEgysegRoute = require('./routes/kozigegysegek')
const vhuPageRoute = require('./routes/vhupage')
const usageRoute = require('./routes/usage')
const valasztokeruletRoute = require('./routes/valasztokeruletek')
const eredmenyekRoute = require('./routes/eredmenyek')

dotenv.config()
const app =  express();

const corsOptions = {
  origin: '*',
  credentials: false,
  exposedHeaders: [ 'X-Total-Count', 'X-Prev-Page', 'X-Next-Page' ]
};

// Middlewares
app.use(bodyParser.json({limit: '50mb'}))
app.use(cors(corsOptions))

app.use('/', express.static(path.join(__dirname, 'apidoc')))
app.use('/kozigegysegek', kozigEgysegRoute)
app.use('/szavazokorok', szkRoute)
app.use('/usage', usageRoute)
app.use('/vhupage', vhuPageRoute)
app.use('/valasztokeruletek', valasztokeruletRoute)

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
},
() => console.log('connected to DB'))

// Listen
var port = process.env.PORT || 1338
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
