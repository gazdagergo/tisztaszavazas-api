import { Schema, model } from 'mongoose';
import KozigEgysegSchema from './KozigEgyseg';

// https://stackoverflow.com/questions/55096055/mongoose-different-ways-to-reference-subdocuments

const KorzethatarSchema = new Schema({
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

const PointSchema = new Schema({
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

const KozteruletSchema = Schema({
	"leiras": String,
	"kozteruletNev": String,
	"kezdoHazszam": Number,
	"vegsoHazszam": Number,
	"megjegyzes": String,
})

const ValasztokeruletSchema = new Schema({
  tipus: String,
  leiras: String,
  szam: Number
})

model('kozigEgyseg', KozigEgysegSchema);

const SzavazokorSchema = Schema({
  szavazokorSzama: Number,
  szavazokorCime: String,
  kozigEgyseg: {
    type: Schema.Types.ObjectId,
    ref: 'kozigEgyseg'
  },
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

export const onk2019_v1_szavazokor = model('onk2019_v1_szavazokor', SzavazokorSchema);
export const onk2019_v2_szavazokor = model('onk2019_v2_szavazokor', SzavazokorSchema);
export const ogy2018_v1_szavazokor = model('ogy2018_v1_szavazokor', SzavazokorSchema);
export const ogy2018_v2_szavazokor = model('ogy2018_v2_szavazokor', SzavazokorSchema);

export default SzavazokorSchema