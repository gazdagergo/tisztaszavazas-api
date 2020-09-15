import {
	onk2019_v1_szavazokor_url,
	onk2019_v2_szavazokor_url,
	ogy2018_v1_szavazokor_url,
	ogy2018_v2_szavazokor_url,
	idbo620_v1_szavazokor_url,
} from "./SzavazokorUrl"

import {
	onk2019_v1_szavazokor,
	onk2019_v2_szavazokor,
	ogy2018_v1_szavazokor,
	ogy2018_v2_szavazokor,
	idbo620_v1_szavazokor,
} from "./Szavazokor"

import {
	onk2019_v1_kozigegyseg,
	onk2019_v2_kozigegyseg,
	ogy2018_v1_kozigegyseg,
	ogy2018_v2_kozigegyseg,
	idbo620_v1_kozigegyseg,
} from "./KozigEgyseg"

import {
	onk2019_v1_valasztokerulet,
	onk2019_v2_valasztokerulet,
	ogy2018_v1_valasztokerulet,
	ogy2018_v2_valasztokerulet,
	idbo620_v1_valasztokerulet,
} from "./Valasztokerulet"

export default {
	SzavazokorUrl: {
		onk2019: {
			v1: onk2019_v1_szavazokor_url,
			v2: onk2019_v2_szavazokor_url,
			latest: onk2019_v2_szavazokor
		},
		ogy2018: {
			v1: ogy2018_v1_szavazokor_url,
			v2: ogy2018_v2_szavazokor_url,
			latest: ogy2018_v1_szavazokor
		},
		idbo620: {
			v1: idbo620_v1_szavazokor_url,
			latest: idbo620_v1_szavazokor_url,
		}
	},
	Szavazokor: {
		onk2019: {
			v1: onk2019_v1_szavazokor,
			v2: onk2019_v2_szavazokor,
			latest: onk2019_v2_szavazokor
		},
		ogy2018: {
			v1: ogy2018_v1_szavazokor,
			v2: ogy2018_v2_szavazokor,
			latest: ogy2018_v2_szavazokor,
		},
		idbo620: {
			v1: idbo620_v1_szavazokor,
			latest: idbo620_v1_szavazokor,
		},		
	},
	KozigEgyseg: {
		onk2019: {
			v1: onk2019_v1_kozigegyseg,
			v2: onk2019_v2_kozigegyseg,
			latest: onk2019_v2_kozigegyseg,
		},
		ogy2018: {
			v1: ogy2018_v1_kozigegyseg,
			v2: ogy2018_v2_kozigegyseg,
			latest: ogy2018_v2_kozigegyseg,
		},
		idbo620: {
			v1: idbo620_v1_kozigegyseg,
			latest: idbo620_v1_kozigegyseg,
		},
	},
	Valasztokerulet: {
		onk2019: {
			v1: onk2019_v1_valasztokerulet,
			v2: onk2019_v2_valasztokerulet,
			latest: onk2019_v2_valasztokerulet
		},
		ogy2018: {
			v1: ogy2018_v1_valasztokerulet,
			v2: ogy2018_v2_valasztokerulet,
			latest: ogy2018_v2_valasztokerulet
		},
		idbo620: {
			v1: idbo620_v1_valasztokerulet,
			latest: idbo620_v1_valasztokerulet,
		},		
	}
}