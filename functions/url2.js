
export const pad = (num, size) => {
	var s = "000000" + num;
	return s.substr(s.length-size);
}

const getPaddedNumber = (value, paramname) => {
	switch (paramName) {
		case 'megyeKod':
		case 'megyeKod2':
			return pad(value, 2)

		case 'telepulesKod':
		case 'telepulesKod2':
			return pad(value, 3)

		default:
			return value
	}
}

const getPrefixedParams = ({ preId, ...rest }) => (
	Object.entries(rest).reduce((acc = '?', [key, value]) => (
		`${acc}&_${preId}_${key}=${getPaddedNumber(value, key)}`
	), '?')
)

const getPpParams = (params, preId = 'p_p') => (
	Object.entries(params).reduce((acc = '', [key, value], i) => (
		`${acc}&${preId}_${key}=${value}`
	), '')	
)

export const getSzavazokorUrl = ({
	vltId = 687,
	vlId = 294,
	megyeKod,
	telepulesKod,
	szavkorSorszam
}) => (
	`https://www.valasztas.hu/` +
	`szavazokorok_onk2019` +
	getPpParams({
		lifecycle: 1,
		state: 'maximized',
		mode: 'view'
	}) +
	getPrefixedParams({
		preId: 'onkszavazokorieredmenyek_WAR_nvinvrportlet',
		megyeKod,
		telepulesKod,
		szavkorSorszam,	
		vlId,
		vltId,
		tabId: 'tab2'
	})
)

export const getSzavazokorListUrl = ({
	vltId = 687,
	vlId = 294,
	page,
}) => (
	`https://www.valasztas.hu/` +
	`szavazokorok_onk2019` + 
	getPpParams({
		lifecycle: 1,
		state: 'maximized',
		mode: 'view',
		col_id: 'column-2',
		col_count: 1
	}) +
	getPrefixedParams({
		preId: 'onkszavazokorok_WAR_nvinvrportlet',
		delta: 20,
		cur: page,
		vlId,
		vltId,	
		keywords: '',
		advancedSearch: 'false',
		andOperator: 'true',
		searchSortType: 'asc',
		searchSortColumn: 'SZAVAZOKOR_CIME'
	})
)

export const getPolygonUrl = ({
	vltId = 687,
	vlId = 294,
	telepulesKod,
	megyeKod,
	szavkorSorszam,	
}) => (
	`https://www.valasztas.hu/` +
	`szavazokorok_onk2019` + 
	getPpParams({
		lifecycle: 1,
		state: 'maximized',
		mode: 'view',
		resource_id: 'resourceIdGetElectionMapData',
		cacheability: 'cacheLevelPage',
	}) +
	getPrefixedParams({
		preId: 'onkszavazokorieredmenyek_WAR_nvinvrportlet',
		vlId,
		vltId,
		telepulesKod,
		megyeKod,
		szavkorSorszam,
		tabId: 'tab2',
	})
)

export const getUtcaKeresoUrl = ({
	vltId = 687,
	vlId = 294,
	telepulesKod,
	megyeKod,
	keywords
}) => (
	`https://www.valasztas.hu/` +
	`szavazohelyiseg-kereso_onk_2019` +
	getPpParams({
		lifecycle: 2,
		state: 'normal',
		mode: 'view',
		resource_id: 'resourceIdGetUtcaKozterulet',
		cacheability: 'cacheLevelPage',
		col_id: 'column-2',
		col_count: 1
	}) +
	getPrefixedParams({
		preId: 'wardsearch_WAR_nvinvrportlet',
		vlId,
		vltId,
		telepulesKod,
		megyeKod,
		keywords // Bástya utca
	})
)

export const getHazszamKeresoUrl = ({
	vltId = 687,
	vlId = 294,
	telepulesKod,
	megyeKod,
	kozterNev, // Bástya
	kozterJelleg, // utca
	keywords // 1, 2 ...
}) => (
	`https://www.valasztas.hu/` +
	`szavazohelyiseg-kereso_onk_2019` +
	getPpParams({
		lifecycle: 2,
		state: 'normal',
		mode: 'view',
		resource_id: 'resourceIdGetHazszam',
		cacheability: 'cacheLevelPage',
		col_id: 'column-2',
		col_count: 1
	}) +
	getPrefixedParams({
		preId: 'wardsearch_WAR_nvinvrportlet',
		vlId,
		vltId,
		telepulesKod,
		megyeKod,
		kozterNev,
		kozterJelleg,
		keywords
	})
)