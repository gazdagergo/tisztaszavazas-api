const pad = (num, size) => {
	var s = "000000" + num;
	return s.substr(s.length-size);
}

export default (megyeKod, telepulesKod, szavkorSorszam) => {
	const preId = 'onkszavazokorieredmenyek_WAR_nvinvrportlet';
	
	return `https://www.valasztas.hu/` + 
	`szavazokorok_onk2019` + 
	`?p_p_id=${preId}` + 
	`&p_p_lifecycle=1` + 
	`&p_p_state=maximized` + 
	`&p_p_mode=view` + 
	`&_${preId}_tabId=tab2` + 
	`&_${preId}_telepulesKod=${pad(telepulesKod, 3)}` + 
	`&_${preId}_megyeKod=${pad(megyeKod, 2)}` + 
	`&_${preId}_vlId=294` + 
	`&_${preId}_vltId=687` + 
	`&_${preId}_szavkorSorszam=${szavkorSorszam}`
}