import mongoose from 'mongoose';

const SzavazokorSchema = mongoose.Schema({
  valasztasAzonosito: String,
  szavazokorSzama: Number,
  szavazokorCime: String,
  kozigEgyseg: {
    type: Object,
    ref: 'KozigEgyseg'
  },
  valasztokerulet: {
    type: Object,
    ref: 'Valasztokerulet'
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
  akadalymentes: Boolean,
  frissitveValasztasHun: Date
})

export default mongoose.model('Szavazokor', SzavazokorSchema);