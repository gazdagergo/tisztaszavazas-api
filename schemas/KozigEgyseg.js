import mongoose from 'mongoose';

const KozigEgysegSchema = mongoose.Schema({
  megyeNeve: String,
  megyeKod: Number,
  telepulesKod: Number,
  kozigEgysegNeve: String,
  kozteruletek: Array,
  tipus: String,
  tipusKod: {
    type: String,
    enum: ['ME', 'FV', 'MV', 'BK', 'TF', 'TA',]
  },  
})

export const KozigEgyseg = mongoose.model('KozigEgyseg', KozigEgysegSchema);

const KozigEgyseg_onk2019 = mongoose.model('KozigEgyseg_onk2019', KozigEgysegSchema);

export default {
  KozigEgyseg_onk2019
}