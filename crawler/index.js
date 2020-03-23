import { scraper_GET } from "../routes/scrape";
import Process from "../schemas/Process";

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const crawl = async (szavazokorok, query) => {
	try {
		const { 0: { _id: processId } } = await Process.insertMany([{ isRunning: true }])
		for (({ _id: szavazokorId }) of szavazokorok) {
			const { isRunning } = await Process.findById(processId);
			if (!isRunning) break;

			await sleep(randomInt(6000, 11000))
			const [code, { message }] = await scraper_GET(szavazokorId, query)
			console.log(code, message, szavazokorId )

		}
		console.log('crawling done')
	} catch(error){
		console.log(error)
	}
}