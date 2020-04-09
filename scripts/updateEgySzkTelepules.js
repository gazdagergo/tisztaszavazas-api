import dotenv from 'dotenv'
import mongoose from 'mongoose';
import Szavazokor from '../schemas/Szavazokor';

dotenv.config()

;(async () => {

	console.log('connecting')
	await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
	console.log('connected')

	console.log('querying')
	const res = await Szavazokor.Szavazokor_onk2019.updateMany({
		egySzavazokorosTelepules: false
	}, { 'kozigEgyseg.egySzavazokorosTelepules': false })
	console.log(res)
	return
})()