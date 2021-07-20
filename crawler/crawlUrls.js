import axios from "axios";
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import url from 'url'
import SzavazokorUrl from "../schemas/SzavazokorUrl";
import generateVhuUrl from "../functions/generateVhuUrl";
import parse from "../routes/scrape/parse";
import { sleep } from ".";

dotenv.config()

const valasztasAzonosito = process.argv[2] || 'onk2019';
const MAX_MEGYEKOD = 20

;(async () => {

	await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

	for (let mk = 1; mk <= MAX_MEGYEKOD; mk+=1 ) {
		for (let i = 1; i < 9999; i+=1) {
			const query = {
				context: 'szavazokorok',
				'kozigEgyseg.megyeKod': mk,
				page: i
			}

			const szkListUrl = generateVhuUrl(query, valasztasAzonosito)
			console.log('------', mk, i)
			try {
				const { data: html } = await axios.get(szkListUrl);
				const parsed = await parse(html, 'parseSzkList.py')
				await sleep(1500)
				if (parsed.error === 'NoResult') {
					console.log('done')
					break;
				}
 				const urlArray = parsed.szkParams.map(({ szkUrl }) => ({
					url: szkUrl,
					query: szkUrl && url.parse(szkUrl, true)['query']
				}))
				.filter(({ url }) => url)

				const response = await SzavazokorUrl.insertMany(urlArray)
				console.log(response)		
			} catch(error){
				console.log(error)
				console.log('done, error')
				break;			
			}
		}
	}
})()