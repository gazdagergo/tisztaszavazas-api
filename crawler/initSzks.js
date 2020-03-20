import dotenv from 'dotenv'
import mongoose from 'mongoose';
import SzavazokorUrl from "../schemas/SzavazokorUrl";
import generateVhuUrl, { getUrlParams } from '../functions/generateVhuUrl';
import Szavazokor from '../schemas/Szavazokor';

dotenv.config()

const valasztasAzonosito = process.argv[2] || 'onk2019';

;(async () => {
	await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
	let { preId } = getUrlParams(valasztasAzonosito);
	const urlEntries = await SzavazokorUrl.find();
	const toInsert = urlEntries.map(({ query }) => {
		const telepulesKod = +query[`_${preId}_telepulesKod`]
		const megyeKod = +query[`_${preId}_megyeKod`]
		const szavazokorSzama = +query[`_${preId}_szavkorSorszam`]

		const polygonUrl = generateVhuUrl({
			valasztasAzonosito,
			'kozigEgyseg.megyeKod': megyeKod,
			'kozigEgyseg.telepulesKod': telepulesKod,
			szavazokorSzama,
			context: 'polygon'
		})

		const vhuUrl = generateVhuUrl({
			valasztasAzonosito,
			'kozigEgyseg.megyeKod': megyeKod,
			'kozigEgyseg.telepulesKod': telepulesKod,
			szavazokorSzama,
			context: 'szavazokorieredmenyek'
		})

		return {
			szavazokorSzama,
			kozigEgyseg: {
				megyeKod,
				telepulesKod
			},
			vhuUrl,
			polygonUrl,
			valasztasAzonosito
		}
	})

	const response = await Szavazokor.insertMany(toInsert)
	console.log(response.length)

})()