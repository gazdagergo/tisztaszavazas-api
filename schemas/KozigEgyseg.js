import mongoose from 'mongoose';

const KozigEgysegSchema = mongoose.Schema({
  megyeNeve: String,
  megyeKod: Number,
  telepulesKod: Number,
  kozigEgysegNeve: String,
  kozteruletek: Array,
  egySzavazokorosTelepules: Boolean,
  tipus: String,
  tipusKod: {
    type: String,
    enum: ['ME', 'FV', 'MV', 'BK', 'TF', 'TA',]
  },  
})

export default mongoose.model('KozigEgyseg', KozigEgysegSchema);