import { Schema, model } from 'mongoose';

const KozigEgysegSchema = new Schema({
  megyeNeve: String,
  megyeKod: Number,
  telepulesKod: Number,
  kozigEgysegNeve: String,
})

export const KozigEgyseg_onk2019_v1 = model('KozigEgyseg_onk2019_v1', KozigEgysegSchema);
export const KozigEgyseg_ogy2018_v1 = model('KozigEgyseg_ogy2018_v1', KozigEgysegSchema);

export default KozigEgysegSchema
