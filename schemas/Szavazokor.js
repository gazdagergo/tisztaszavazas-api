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

model('kozigEgysegRef', KozigEgysegSchema);

const SzavazokorSchema = Schema({
  szavazokorSzama: Number,
  szavazokorCime: String,
  kozigEgyseg: KozigEgysegSchema,
  kozigEgysegRef: {
    type: Schema.Types.ObjectId,
    ref: 'kozigEgysegRef'
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

export const Szavazokor_onk2019_v1 = model('Szavazokor_onk2019_v1', SzavazokorSchema);
export const Szavazokor_onk2019_v2 = model('Szavazokor_onk2019_v2', SzavazokorSchema);
export const Szavazokor_ogy2018_v1 = model('Szavazokor_ogy2018_v1', SzavazokorSchema);

export default {
  Szavazokor_onk2019_v1,
  Szavazokor_onk2019_v2,
  Szavazokor_ogy2018_v1,
}