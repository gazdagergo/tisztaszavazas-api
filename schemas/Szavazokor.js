import mongoose from 'mongoose';

const SzavazokorSchema = mongoose.Schema({
  kod: String,
  kozteruletek: Object
})

export default mongoose.model('Szavazokor', SzavazokorSchema);