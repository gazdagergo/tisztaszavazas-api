import dotenv from 'dotenv'
import mongoose from 'mongoose';
import Szavazokor from '../schemas/Szavazokor';
import KozigEgyseg from '../schemas/KozigEgyseg';

dotenv.config()

const aggregateKozigEgysegek = async () => {
	const kozigEgysegek = await Szavazokor.aggregate([
    { $group: {
      _id: null,
      kozigEgyseg: {
        $addToSet: {
          kozigEgyseg: '$kozigEgyseg'
        }
      }
    }},
    { $unwind: '$kozigEgyseg' },
    { $sort: {
      'kozigEgyseg.kozigEgyseg.megyeKod':  1,
      'kozigEgyseg.kozigEgyseg.telepulesKod':  1
    } },
    { $addFields: {
      megyeKod: '$kozigEgyseg.kozigEgyseg.megyeKod',
      telepulesKod: '$kozigEgyseg.kozigEgyseg.telepulesKod',
      megyeNeve: '$kozigEgyseg.kozigEgyseg.megyeNeve',
      kozigEgysegNeve: '$kozigEgyseg.kozigEgyseg.kozigEgysegNeve',
    }},
    { $project: {
      kozigEgyseg: 0
    }}
	])

	return kozigEgysegek;
}


const getKozteruletek = async ({ megyeKod, telepulesKod }) => {
	const result = await Szavazokor.aggregate([
    { $match: {
			'kozigEgyseg.megyeKod': megyeKod,
			'kozigEgyseg.telepulesKod': telepulesKod,
		} },
    { $unwind: "$kozteruletek" },
    { $replaceRoot: { newRoot: "$kozteruletek" } },
    { $group: {
      _id: 'a',
      kozteruletek: {
      $addToSet: {
        kozteruletNev: '$kozteruletNev'
      }
    } } },
    { $unwind: "$kozteruletek" },
    { $sort: { 'kozteruletek.kozteruletNev':  1 } },
    { $group: {
      "_id": null,
      kozteruletek: { $push: '$kozteruletek' } }
    },
	])

	return result && result[0] && result[0].kozteruletek;
}


;(async () => {

	await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

 	console.log('aggregating...')
	await aggregateKozigEgysegek()

	console.log('deleting...')
	await KozigEgyseg.deleteMany()

	console.log('inserting...')
	await KozigEgyseg.insertMany(kozigEgysegek)

	const kozigEgysegek = await KozigEgyseg.find()

	for ({ _id, megyeKod, telepulesKod, kozigEgysegNeve } of kozigEgysegek) {
		const kozteruletek = await getKozteruletek({ megyeKod, telepulesKod })
		console.log('inserting', megyeNeve, kozigEgysegNeve, kozteruletek && kozteruletek.length, 'kozterulet')
		const result = await KozigEgyseg.updateOne({ _id }, { kozteruletek })
		console.log(result.nModified, 'modified')
	}

	return
})()