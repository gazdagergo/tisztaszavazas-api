import KozigEgyseg from "../schemas/KozigEgyseg"
import Kozterulet from "../schemas/Kozterulet";

export default query => {
	const kozigEgysegParams = Object.keys(KozigEgyseg.schema.paths).filter(key => !key.startsWith('_'))
	const kozteruletParams = Object.keys(Kozterulet.schema.paths).filter(key => !key.startsWith('_'))
	
	
	const queryEntries = Object.entries(query);
	if (!queryEntries.length) return query

	return queryEntries.reduce((acc = {}, [key, value]) => {
		if (kozigEgysegParams.includes(key)){
			return { ...acc, [`kozigEgyseg.${key}`]: value }
		}
		if (kozteruletParams.includes(key)) {
			return { ...acc, [`kozteruletek.${key}`]: value }
		}
		return { ...acc, [key]: value }
	}, {})
}