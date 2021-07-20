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

const KozigEgysegSchema = new mongoose.Schema({
  megyeNeve: String,
  megyeKod: Number,
  telepulesKod: Number,
  kozigEgysegNeve: String,
})

const KozteruletSchema = mongoose.Schema({
	"leiras": String,
	"kozteruletNev": String,
	"kezdoHazszam": Number,
	"vegsoHazszam": Number,
	"megjegyzes": String,
})

const ValasztokeruletSchema = new mongoose.Schema({
  tipus: String,
  leiras: String,
  szam: Number
})

const SzavazokorSchema = mongoose.Schema({
  szavazokorSzama: Number,
  szavazokorCime: String,
  kozigEgyseg: KozigEgysegSchema,
  valasztokerulet: ValasztokeruletSchema,
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
  valasztokSzama: Number
},
{
  timestamps: true  
})

const Szavazokor_onk2019_v1 = mongoose.model('Szavazokor_onk2019_v1', SzavazokorSchema);
const Szavazokor_onk2019_v2 = mongoose.model('Szavazokor_onk2019_v2', SzavazokorSchema);
const Szavazokor_ogy2018_v1 = mongoose.model('Szavazokor_ogy2018_v1', SzavazokorSchema);

export default {
  Szavazokor_onk2019_v1,
  Szavazokor_onk2019_v2,
  Szavazokor_onk2019: Szavazokor_onk2019_v2,
  Szavazokor_ogy2018_v1
}