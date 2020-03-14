const pad = (num, size) => {
	var s = "000000" + num;
	return s.substr(s.length-size);
}

const vltId = 687
const vlId = 294
const valasztasAzon = 'onk2019'

export default (megyeKod, telepulesKod, szavkorSorszam, polygon = false) => {
	const preId = 'onkszavazokorieredmenyek_WAR_nvinvrportlet';

	if (polygon) {
		return `https://www.valasztas.hu/` + 
		`szavazokorok_${valasztasAzon}` +
		`?p_p_id=${preId}` +
		`&p_p_lifecycle=2` +
		`&p_p_state=maximized` +
		`&p_p_mode=view` +
		`&p_p_resource_id=resourceIdGetElectionMapData` +
		`&p_p_cacheability=cacheLevelPage` +
		`&_${preId}_telepulesKod=${pad(telepulesKod, 3)}` +
		`&_${preId}_megyeKod=${pad(megyeKod, 2)}` +
		`&_${preId}_vlId=${vlId}` +
		`&_${preId}_szavkorSorszam=${szavkorSorszam}` +
		`&p_p_lifecycle=1` +
		`&_${preId}_tabId=tab2` +
		`&_${preId}_vltId=${vltId}`
	}
	
	return `https://www.valasztas.hu/` + 
	`szavazokorok_${valasztasAzon}` + 
	`?p_p_id=${preId}` + 
	`&p_p_lifecycle=1` + 
	`&p_p_state=maximized` + 
	`&p_p_mode=view` + 
	`&_${preId}_tabId=tab2` + 
	`&_${preId}_telepulesKod=${pad(telepulesKod, 3)}` + 
	`&_${preId}_megyeKod=${pad(megyeKod, 2)}` + 
	`&_${preId}_vlId=${vlId}` + 
	`&_${preId}_vltId=${vltId}` + 
	`&_${preId}_szavkorSorszam=${szavkorSorszam}`
}