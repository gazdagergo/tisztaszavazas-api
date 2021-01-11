import { Schema, model } from 'mongoose';

const ValasztokeruletSchema = Schema({
	tipus: String,
	leiras: String,
	szam: Number,
	korzethatar:  {
		type: {
			type: String,
			enum: ['Polygon'],
			required: true
		},
		coordinates: {
			type: [[[Number]]], // Array of arrays of arrays of numbers
			required: true
		}
	}
})

export const onk2019_v1_valasztokerulet = model('onk2019_v1_valasztokerulet', ValasztokeruletSchema);
export const onk2019_v2_valasztokerulet = model('onk2019_v2_valasztokerulet', ValasztokeruletSchema);
export const ogy2018_v1_valasztokerulet = model('ogy2018_v1_valasztokerulet', ValasztokeruletSchema);
export const ogy2018_v2_valasztokerulet = model('ogy2018_v2_valasztokerulet', ValasztokeruletSchema);
export const idbo620_v1_valasztokerulet = model('idbo620_v1_valasztokerulet', ValasztokeruletSchema);

export default ValasztokeruletSchema;