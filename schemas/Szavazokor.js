import mongoose from 'mongoose';

const SzavazokorSchema = mongoose.Schema({
  kod: String,
  kozteruletek: Array,
  szavkorSorszam: Number,
  telepules: {
    type: Object,
    ref: 'KozigEgyseg'
  }
})

export default mongoose.model('Szavazokor', SzavazokorSchema);