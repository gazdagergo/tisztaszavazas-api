const pad = (num, size) => {
	var s = "000000" + num;
	return s.substr(s.length-size);
}


export default query => {
		const megyeKod = query['kozigEgyseg.megyeKod'];
		const telepulesKod = query['kozigEgyseg.telepulesKod'];

		const {
			szavazokorSzama,
			polygon = false,
			valasztasAzonosito = 'onk2019'
		} = query

		let vPre, vltId, vlId, uiParam, preId;

		switch (valasztasAzonosito) {
			case 'onk2019': {
				vPre = 'onk';
				vltId = 687;
				vlId = 294;
				preId = `${vPre}szavazokorieredmenyek_WAR_nvinvrportlet`;
				uiParam = `&_${preId}_tabId=tab2`;
				break;
			}

			case 'ep2019': {
				vPre = 'ep';
				vltId = 684;
				vlId = 291;
				preId = `${vPre}szavazokorieredmenyek_WAR_nvinvrportlet`;
				uiParam = `&p_p_col_id=column-2&p_p_col_count=1`;
				break;
			}
			default: return ''
		}


	if (polygon) {
		return `https://www.valasztas.hu/` + 
		`szavazokorok_${valasztasAzonosito}` +
		`?p_p_id=${preId}` +
		`&p_p_lifecycle=2` +
		`&p_p_state=maximized` +
		`&p_p_mode=view` +
		`&p_p_resource_id=resourceIdGetElectionMapData` +
		`&p_p_cacheability=cacheLevelPage` +
		`&_${preId}_telepulesKod=${pad(telepulesKod, 3)}` +
		`&_${preId}_megyeKod=${pad(megyeKod, 2)}` +
		`&_${preId}_vlId=${vlId}` +
		`&_${preId}_szavkorSorszam=${szavazokorSzama}` +
		`&p_p_lifecycle=1` +
		`${uiParam}` +
		`&_${preId}_vltId=${vltId}`
	}
	
	return `https://www.valasztas.hu/` + 
	`szavazokorok_${valasztasAzonosito}` + 
	`?p_p_id=${preId}` + 
	`&p_p_lifecycle=1` + 
	`&p_p_state=maximized` + 
	`&p_p_mode=view` + 
	`${uiParam}` + 
	`&_${preId}_telepulesKod=${pad(telepulesKod, 3)}` + 
	`&_${preId}_megyeKod=${pad(megyeKod, 2)}` + 
	`&_${preId}_vlId=${vlId}` + 
	`&_${preId}_vltId=${vltId}` + 
	`&_${preId}_szavkorSorszam=${szavazokorSzama}`
}
