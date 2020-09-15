import { Schema, model } from 'mongoose';

const KozigEgysegSchema = new Schema({
  megyeNeve: String,
  megyeKod: Number,
  telepulesKod: Number,
  kozigEgysegNeve: String,
})

export const onk2019_v1_kozigegyseg = model('onk2019_v1_kozigegyseg', KozigEgysegSchema);
export const onk2019_v2_kozigegyseg = model('onk2019_v2_kozigegyseg', KozigEgysegSchema);
export const ogy2018_v1_kozigegyseg = model('ogy2018_v1_kozigegyseg', KozigEgysegSchema);
export const ogy2018_v2_kozigegyseg = model('ogy2018_v2_kozigegyseg', KozigEgysegSchema);
export const idbo620_v1_kozigegyseg = model('idbo620_v1_kozigegyseg', KozigEgysegSchema);

export default KozigEgysegSchema
