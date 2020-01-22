import axios from 'axios';
import dotenv from 'dotenv'

dotenv.config()

const { BASE_URL } = process.env;

export default async (name, value1) => {
	try {
		const response = await axios.get(`${BASE_URL}/devices/${name}`)
		
		if (response.status !== 200) {
			return [ response.status,  response.body ];
		}

		const { value1: currentTemp } = response.data;
		const newTemp = parseFloat(currentTemp) + parseFloat(value1);

		const response2 = await axios.put(`${BASE_URL}/devices/${name}`, {
			value1: newTemp
		})

		if (!response2.data.ok) {
			return [ 500, 'Database error' ]
		}
		
		return [ 200, `New temp set for ${name}: ${newTemp}` ];

	} catch(error) {
		console.log(error);
		if (error.response) {
			const { data, status } = error.response;
			return [ status, data ];
		} else {
			return [ 500, error.message ]
		}
	}
}