import Szavazokor from "./schemas/Szavazokor";
import { scraper_GET } from "./routes/scrape";

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const crawl = async query => {
	try {
		const szavazokorok = await Szavazokor.find(query);

		for (({ szavkorSorszam, kozigEgyseg: { megyeKod, telepulesKod } }) of szavazokorok) {
			const [code, { message }] = await scraper_GET(
				null, {
					szavkorSorszam, 
					'kozigEgyseg.megyeKod': megyeKod,
					'kozigEgyseg.telepulesKod': telepulesKod
				}
			)
			console.log(code, message, szavkorSorszam,  megyeKod, telepulesKod )
			await sleep(randomInt(12000, 24000))
		}
	} catch(error){
		console.log(error)
	}
}