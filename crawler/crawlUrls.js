import axios from "axios";
import generateVhuUrl from "../functions/generateVhuUrl";
import parse from "../routes/scrape/parse";

(async () => {
	const query = {
		context: 'szavazokorok',
		'kozigEgyseg.megyeKod': 2,
		page: 1
	}

	const szkListUrl = generateVhuUrl(query)

	const { data: html } = await axios.get(szkListUrl);

	const parsed = await parse(html, 'parseSzkList.py')

	console.log(parsed)
})()