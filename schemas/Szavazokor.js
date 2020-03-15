import mongoose from 'mongoose';

const SzavazokorSchema = mongoose.Schema({
  valasztasAzonosito: String,
  szavazokorSzama: Number,
  szavkorCim: String,
  kozigEgyseg: {
    type: Object,
    ref: 'KozigEgyseg'
  },
  kozteruletek: [{
    type: Object,
    ref: 'Kozterulet'
  }],
  vhuUrl: String,
  polygonUrl: String,
  egySzavazokorosTelepules: Boolean,
  sourceHtmlUpdated: Date,
  sourceHtmlEntryId: String,
  parsedFromSrcHtml: Date,
})

export default mongoose.model('Szavazokor', SzavazokorSchema);