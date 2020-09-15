import { Schema, model } from 'mongoose';
import KozigEgyseg from './KozigEgyseg';
import Valasztokerulet from './Valasztokerulet'

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

const Kozterulet = Schema({
	"leiras": String,
	"kozteruletNev": String,
	"kezdoHazszam": Number,
	"vegsoHazszam": Number,
	"megjegyzes": String,
})

model('KozigEgysegModel', KozigEgyseg);
const kozigEgysegWithRefSchema = new Schema(KozigEgyseg)
kozigEgysegWithRefSchema.kozigEgysegRef = {
  type: Schema.Types.ObjectId,
  ref: 'KozigEgysegModel'
}
new Schema(kozigEgysegWithRefSchema)

model('ValasztokeruletModel', Valasztokerulet);
const valaztokeruletWithRefSchema = new Schema(Valasztokerulet)
valaztokeruletWithRefSchema.valasztoKeruletRef = {
  type: Schema.Types.ObjectId,
  ref: 'ValasztokeruletModel'
}
new Schema(valaztokeruletWithRefSchema)


const SzavazokorSchema = Schema({
  szavazokorSzama: Number,
  szavazokorCime: String,
  kozigEgyseg: {
    type: Object,
    ref: 'kozigEgysegWithRefSchema'
  },
  valasztokerulet: {
    type: Object,
    ref: 'valaztokeruletWithRefSchema'
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
  valasztokSzama: Number
},
{
  timestamps: true  
})

export const onk2019_v1_szavazokor = model('onk2019_v1_szavazokor', SzavazokorSchema);
export const onk2019_v2_szavazokor = model('onk2019_v2_szavazokor', SzavazokorSchema);
export const ogy2018_v1_szavazokor = model('ogy2018_v1_szavazokor', SzavazokorSchema);
export const ogy2018_v2_szavazokor = model('ogy2018_v2_szavazokor', SzavazokorSchema);
export const idbo620_v1_szavazokor = model('idbo620_v1_szavazokor', SzavazokorSchema);

export default SzavazokorSchema