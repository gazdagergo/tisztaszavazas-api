import dotenv from 'dotenv'
import mongoose from 'mongoose';
import KozigEgyseg from '../schemas/KozigEgyseg';

dotenv.config()

;(async () => {
	const db = process.argv[2]
	console.log('connecting')
	await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
	console.log('connected')

	console.log('querying')
	const res = await KozigEgyseg[`KozigEgyseg_${db}`].updateMany({
		kozteruletek: { $ne: null }
	}, { 'egySzavazokorosTelepules': false })	
	console.log(res)
	return
})()