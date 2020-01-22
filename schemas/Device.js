import mongoose from 'mongoose';

const DeviceSchema = mongoose.Schema({
  name: String,
  value1: Number
})

export default mongoose.model('Device', DeviceSchema);