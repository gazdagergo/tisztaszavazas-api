import {
	Szavazokor_onk2019_v1,
	Szavazokor_onk2019_v2,
	Szavazokor_ogy2018_v1 } from "./Szavazokor"

import {
	KozigEgyseg_onk2019_v1,
	KozigEgyseg_ogy2018_v1 } from "./KozigEgyseg"

export default {
	Szavazokor: {
		onk2019: {
			v1: Szavazokor_onk2019_v1,
			v2: Szavazokor_onk2019_v2,
			latest: Szavazokor_onk2019_v2
		},
		ogy2018: {
			v1: Szavazokor_ogy2018_v1,
			latest: Szavazokor_ogy2018_v1
		}
	},
	KozigEgyseg: {
		onk2019: {
			v1: KozigEgyseg_onk2019_v1,
			latest: KozigEgyseg_onk2019_v1,
		},
		ogy2018: {
			v1: KozigEgyseg_ogy2018_v1,
			latest: KozigEgyseg_ogy2018_v1,
		}
	}
}