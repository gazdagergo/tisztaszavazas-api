import { scraper_GET } from "../routes/scrape";

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const crawl = async (szavazokorok, query) => {
	try {
		for (({ _id: szavazokorId }) of szavazokorok) {
			const [code, { message }] = await scraper_GET(szavazokorId, query)
			console.log(code, message, szavazokorId )
			await sleep(randomInt(24000, 35000))
		}
		console.log('crawling done')
	} catch(error){
		console.log(error)
	}
}