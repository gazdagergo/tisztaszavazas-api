import axios from 'axios';

export default async url => {
	const resp = await axios.get(url);
	return resp.data;
}