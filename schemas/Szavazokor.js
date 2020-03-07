import mongoose from 'mongoose';

const SzavazokorSchema = mongoose.Schema({
  kozteruletek: Array,
  szavkorSorszam: Number,
  kozigEgyseg: {
    type: Object,
    ref: 'KozigEgyseg'
  }
})

export default mongoose.model('Szavazokor', SzavazokorSchema);