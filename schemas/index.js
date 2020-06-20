import {
	onk2019_v1_szavazokor,
	onk2019_v2_szavazokor,
	ogy2018_v1_szavazokor,
	ogy2018_v2_szavazokor,
} from "./Szavazokor"

import {
	onk2019_v1_kozigegyseg,
	onk2019_v2_kozigegyseg,
	ogy2018_v1_kozigegyseg,
	ogy2018_v2_kozigegyseg,
} from "./KozigEgyseg"

export default {
	Szavazokor: {
		onk2019: {
			v1: onk2019_v1_szavazokor,
			v2: onk2019_v2_szavazokor,
			latest: onk2019_v2_szavazokor
		},
		ogy2018: {
			v1: ogy2018_v1_szavazokor,
			v2: ogy2018_v2_szavazokor,
			latest: ogy2018_v2_szavazokor
		}
	},
	KozigEgyseg: {
		onk2019: {
			v1: onk2019_v1_kozigegyseg,
			v1: onk2019_v2_kozigegyseg,
			latest: onk2019_v2_kozigegyseg,
		},
		ogy2018: {
			v1: ogy2018_v1_kozigegyseg,
			v2: ogy2018_v2_kozigegyseg,
			latest: ogy2018_v2_kozigegyseg,
		}
	}
}