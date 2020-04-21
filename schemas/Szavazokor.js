import mongoose from 'mongoose';

const KorzethatarSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Polygon'],
    required: true
  },
  coordinates: {
    type: [[[Number]]], // Array of arrays of arrays of numbers
    required: true
  }
});

const PointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const SzavazokorSchema = mongoose.Schema({
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
  korzethatar: KorzethatarSchema,
  szavazohelyisegHelye: PointSchema,
  polygonUrl: String,
  sourceHtmlUpdated: Date,
  parsedFromSrcHtml: Date,
  akadalymentes: Boolean,
  frissitveValasztasHun: Date,
  valasztokSzama: Number,
  helyadatok: Object
},
{
  timestamps: true  
})

const Szavazokor_onk2019 = mongoose.model('Szavazokor_onk2019', SzavazokorSchema);
const Szavazokor_tests = mongoose.model('Szavazokor_tests', SzavazokorSchema);

export default {
  Szavazokor_onk2019,
  Szavazokor_tests
}