import mongoose from 'mongoose';

const KozigEgysegSchema = mongoose.Schema({
  megyeNeve: String,
  megyeKod: Number,
  telepulesKod: Number,
  kozigEgysegNeve: String,
  kozteruletek: Array, 
})

const KozigEgyseg_onk2019 = mongoose.model('KozigEgyseg_onk2019', KozigEgysegSchema);
const KozigEgyseg_onk2019_v1 = mongoose.model('KozigEgyseg_onk2019_v1', KozigEgysegSchema);

export default {
  KozigEgyseg_onk2019,
  KozigEgyseg_onk2019_v1
}