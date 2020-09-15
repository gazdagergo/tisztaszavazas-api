import mongoose from 'mongoose';

const SzavazokorUrlSchema = mongoose.Schema({
	url: String,
  query: Object
},
{
  timestamps: true
})

export const onk2019_v1_szavazokor_url = mongoose.model('onk2019_v1_szavazokor_url', SzavazokorUrlSchema);
export const onk2019_v2_szavazokor_url = mongoose.model('onk2019_v2_szavazokor_url', SzavazokorUrlSchema);
export const ogy2018_v1_szavazokor_url = mongoose.model('ogy2018_v1_szavazokor_url', SzavazokorUrlSchema);
export const ogy2018_v2_szavazokor_url = mongoose.model('ogy2018_v2_szavazokor_url', SzavazokorUrlSchema);
export const idbo620_v1_szavazokor_url = mongoose.model('idbo620_v1_szavazokor_url', SzavazokorUrlSchema);

export default SzavazokorUrlSchema