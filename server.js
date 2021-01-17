const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')
const path = require('path')
const connectDb = require('./functions/connectDb')

const szkRoute = require('./routes/szavazokorok')
const kozigEgysegRoute = require('./routes/kozigegysegek')
const vhuPageRoute = require('./routes/vhupage')
const usageRoute = require('./routes/usage')
const valasztokeruletRoute = require('./routes/valasztokeruletek')
const eredmenyekRoute = require('./routes/eredmenyek')


dotenv.config()
const app =  express()

connectDb()

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
app.use('/eredmenyek', eredmenyekRoute)

// Listen
var port = process.env.PORT || 1338
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
