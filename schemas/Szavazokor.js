import mongoose from 'mongoose';

const SzavazokorSchema = mongoose.Schema({
  egySzavazokorosTelepules: Boolean,
  szavkorSorszam: Number,
  szavkorCim: String,
  kozigEgyseg: {
    type: Object,
    ref: 'KozigEgyseg'
  },
  kozteruletek: [{
    type: Object,
    ref: 'Kozterulet'
  }],
  sourceHtmlUpdated: Date,
  parsedFromSrcHtml: Date,
})

export default mongoose.model('Szavazokor', SzavazokorSchema);