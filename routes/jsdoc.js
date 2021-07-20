
/**
 * @api {get} /szavazokorok/:id? Egy szavazókör összes adata
 * @apiName szavazokorok
 * @apiGroup szavazokorok
 *
 * @apiParam {String} id A szavazókör azonosítója az adatbázisban
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "_id": "5e77c3f18723e7a7b25c5f72",
 *    "szavazokorSzama": 24,
 *    "kozigEgyseg": {
 *        "megyeNeve": "Somogy",
 *        "kozigEgysegNeve": "Kaposvár"
 *    },
 *    "kozteruletek": [
 *       {
 *            "leiras": "Füredi utca 53 - 67 2 2",
 *            "kozteruletNev": "Füredi utca",
 *            "kezdoHazszam": 53,
 *            "vegsoHazszam": 67,
 *            "megjegyzes": "Páratlan házszámok"
 *        },
 *        {
 *            "leiras": "Kinizsi lakótelep",
 *            "kozteruletNev": "Kinizsi lakótelep",
 *            "kezdoHazszam": null,
 *            "vegsoHazszam": null,
 *            "megjegyzes": "Teljes közterület"
 *        }
 *    ],
 *    "akadalymentes": true,
 *    "egySzavazokorosTelepules": false,
 *    "frissitveValasztasHun": "2020-01-09T14:49:48.000Z",
 *    "szavazokorCime": "Búzavirág utca 21. (Kinizsi Lakótelepi Tagiskola)",
 *    "valasztokSzama": 1345,
 *    "valasztokerulet": {
 *        "leiras": "Kaposvár 2. számú EVK",
 *        "szam": 2
 *    },
 *    "valasztasHuOldal": "http://localhost:1337/vhupage/5e77c3f18723e7a7b25c5f72"
 *    "__v": 1,
 *    "updatedAt": "2020-03-24T20:26:44.292Z",
 * }
 * @apiSampleRequest off
 */


/**
 * @api {get} /szavazokorok/ Összes szavazókör
 * @apiName szavazokorok2
 * @apiGroup szavazokorok
 *
 * @apiParam {Number} limit Csak a megadott számú találatot adja vissza (default 99999)
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *   [
 *     {
 *        "_id": "5e77c3f08723e7a7b25c40b0",
 *        "kozigEgyseg": {
 *          "megyeNeve": "Hajdú-Bihar",
 *          "kozigEgysegNeve": "Esztár"
 *        },
 *        "szavazokorSzama": 1, 
 *        "szavazokorCime": "Kossuth utca 1.",
 *        "akadalymentes": true, 
 *        "valasztokerulet": {
 *          "leiras": "-",
 *          "szam": null
 *        },
 *        "valasztokSzama": 1131,
 *        "__v": 0,
 *     },
 * 		...
 *   ]
 * @apiSampleRequest off
 */


/**
 * @api {get} /szavazokorok?param={value|query} Szavazókörök keresése paraméter alapján
 * @apiName szavazokorok3
 * @apiGroup szavazokorok
 *
 * @apiParam {String|Regex} kozigEgysegNeve A település vagy budapesti kerület neve
 * @apiParam {String|Regex} kozteruletNev A szavazó lakcíme közterületének neve (pl: Bercsényi utca v. /bercs/i)
 * @apiParam {Number|Query} kezdoHazszam A közterület szavazókörhöz tartozó legkisebb házszáma. Lekéréskor relációk használhatók, mint { $lt: 22 }, vagyis 22-nél kisebb
 * @apiParam {Number|Query} vegsoHazszam A közterület szavazókörhöz tartozó legmagasabb házszáma. Lekéréskor relációk használhatók, mint { $gte: 22 }, vagyis 22-nél nagyobb vagy egyenlő
 * 
 * @apiParam {Number} limit Csak a megadott számú találatot adja vissza (default 99999)
 *
 * @apiExample {curl} Example usage:
 *     curl --location --request GET 'http://api.tisztaszavazas.hu/szavazokorok?kozigEgysegNeve=/Hajd%C3%BAhadh%C3%A1z/&kozteruletNev=/Bercs%C3%A9nyi/&kezdoHazszam={%20$lte:%2022%20}&vegsoHazszam={%20$gt:%2022%20}&megjegyzes=P%C3%A1ros%20h%C3%A1zsz%C3%A1mok' \
 *     --header 'Authorization: {jwt-token} \
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *   [
 *     {
 *         "_id": "5e77c3f08723e7a7b25c4089",
 *         "szavazokorSzama": 6,
 *         "kozigEgyseg": {
 *             "megyeNeve": "Hajdú-Bihar",
 *             "kozigEgysegNeve": "Hajdúhadház"
 *         },
 *         "kozteruletek": [
 *             {
 *                 "leiras": "Bercsényi utca 14 - 60",
 *                 "kozteruletNev": "Bercsényi utca",
 *                 "kezdoHazszam": 14,
 *                 "vegsoHazszam": 60,
 *                 "megjegyzes": "Páros házszámok"
 *             }
 *         ]
 *     }
 *   ]
 * @apiSampleRequest off
 */