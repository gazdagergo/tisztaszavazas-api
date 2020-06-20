import { Schema, model } from 'mongoose';

const ValasztokeruletSchema = Schema({
	tipus: String,
	leiras: String,
	szam: Number
})

export const onk2019_v1_valasztokerulet = model('onk2019_v1_valasztokerulet', ValasztokeruletSchema);
export const onk2019_v2_valasztokerulet = model('onk2019_v2_valasztokerulet', ValasztokeruletSchema);
export const ogy2018_v1_valasztokerulet = model('ogy2018_v1_valasztokerulet', ValasztokeruletSchema);
export const ogy2018_v2_valasztokerulet = model('ogy2018_v2_valasztokerulet', ValasztokeruletSchema);

export default ValasztokeruletSchema;