import mongoose from 'mongoose';

const ProcessSchema = mongoose.Schema({
	isRunning: Boolean,
},
{
  timestamps: true
})

export default mongoose.model('Process', ProcessSchema);