import { pad } from './stringFunctions'

export const getUrlParams = (valasztasAzonosito, prefix = 'szavazokorieredmenyek') => {
	let vPre, preId;
	switch (valasztasAzonosito) {
		case 'onk2019': 
			vPre = 'onk';
			preId = `${vPre}${prefix}_WAR_nvinvrportlet`;
			return ({
				vPre,
				vltId: 687,
				vlId: 294,
				preId,
				uiParam: `&_${preId}_tabId=tab2`
			})

		case 'ep2019': 
			vPre = 'ep';
			preId = `${vPre}${prefix}_WAR_nvinvrportlet`;

			return ({
				vPre,
				vltId: 684,
				vlId: 291,
				preId,
				uiParam: `&p_p_col_id=column-2&p_p_col_count=1`
			})

		default: return null
	}
}

export default query => {
	const megyeKod = query['kozigEgyseg.megyeKod'];
	const telepulesKod = query['kozigEgyseg.telepulesKod'];

	const {
		szavazokorSzama,
		valasztasAzonosito = 'onk2019',
		context = 'szavazokorieredmenyek',  // szavazokorok, polygon
		page,
	} = query

	const prefix = context === 'polygon' ? 'szavazokorieredmenyek' : context;

	let { vltId, vlId, uiParam, preId } = getUrlParams(valasztasAzonosito, prefix)

	switch (context) {
		case 'polygon':
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

		case 'szavazokorok':
			return `https://www.valasztas.hu/` +
			`szavazokorok_${valasztasAzonosito}` + 
			`?p_p_id=${preId}` +
			`&p_p_lifecycle=1` +
			`&p_p_state=maximized` +
			`&p_p_mode=view` +
			`&p_p_col_id=column-2` +
			`&p_p_col_count=1` +
			`&_${preId}_searchSortColumn=SZAVAZOKOR_CIME` +
			`&_${preId}_megyeKod2=${megyeKod ? pad(megyeKod, 2) : ''}` +
			`&_${preId}_vlId=${vlId}` +
			`&_${preId}_searchSortType=asc` +
			`&_${preId}_vltId=${vltId}` +
			`&_${preId}_delta=20` +
			`&_${preId}_keywords=` +
			`&_${preId}_advancedSearch=false` +
			`&_${preId}_andOperator=true` +
			`&_${preId}_resetCur=false` +
			`&_${preId}_cur=${page}`

		default: //szavazokorieredmenyek
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
}

// https://www.valasztas.hu/szavazokorok_onk2019?_onkszavazokorok_WAR_nvinvrportlet_formDate=32503680000000&p_p_id=onkszavazokorok_WAR_nvinvrportlet&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_count=1&_onkszavazokorok_WAR_nvinvrportlet_vlId=294&_onkszavazokorok_WAR_nvinvrportlet_vltId=687&_onkszavazokorok_WAR_nvinvrportlet_searchSortColumn=&_onkszavazokorok_WAR_nvinvrportlet_searchSortType=asc&_onkszavazokorok_WAR_nvinvrportlet_megyeKod2=02