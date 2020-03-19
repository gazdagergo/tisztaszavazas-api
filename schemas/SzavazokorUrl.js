import mongoose from 'mongoose';

const SzavazokorUrlSchema = mongoose.Schema({
	url: String,
  query: Object
},
{
  timestamps: true
})

export default mongoose.model('SzavazokorUrl', SzavazokorUrlSchema);