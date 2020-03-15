import Szavazokor from "./schemas/Szavazokor";
import { scraper_GET } from "./routes/scrape";

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const crawl = async szavazokorok => {
	try {
		for (({ _id: szavazokorId }) of szavazokorok) {
			const [code, { message }] = await scraper_GET(szavazokorId)
			console.log(code, message, szavazokorId )
			await sleep(randomInt(12000, 24000))
		}
		console.log('crawling done')
	} catch(error){
		console.log(error)
	}
}