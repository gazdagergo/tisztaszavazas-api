import mongoose from 'mongoose';

const KozigEgysegSchema = mongoose.Schema({
  megye: String,
  megyeKod: Number,
  telepulesKod: Number,
  nev: String,
  kozigEgysegTipus: String,
  kozigEgysegTipusKod: {
    type: String,
    enum: ['ME', 'FV', 'MV', 'BK', 'TF', 'TA',]
  }
})

export default mongoose.model('KozigEgyseg', KozigEgysegSchema);