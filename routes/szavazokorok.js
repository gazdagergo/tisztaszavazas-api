import express from 'express';
import SzavazokorSchemas from '../schemas/Szavazokor';
import parseQuery from '../functions/parseQuery';
import getSortObject from '../functions/getSortObject';
import authorization from '../middlewares/authorization';
import getSzkAggregationFilter from '../functions/getSzkAggregationFilter';
import { getProjection, mapQueryResult, mapIdResult } from '../functions/szkProjectionAndMap';
import reduceResultByRegex from '../functions/reduceResultByRegex';

/**
 * @api {get} /szavazokorok/ 1.) Összes szavazókör
 * @apiName szavazokorok2
 * @apiGroup Szavazókörök
 *
 * @apiParam {Number} limit Csak a megadott számú találatot adja vissza (default: `20`)
 * @apiParam {Number} skip A lapozáshoz használható paraméter. (default: `0`)
 * @apiHeader X-Valasztas-Kodja A választási adatbázis kiválasztása (default: `onk2019`)
 * @apiHeader Authorization A regisztrációkor kapott kulcs
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *     {
 *       "_id": "5e77c3f08723e7a7b25c411a",
 *       "szavazokorSzama": 1,
 *       "kozigEgyseg": {
 *           "megyeNeve": "Hajdú-Bihar",
 *           "kozigEgysegNeve": "Balmazújváros",
 *           "link": "/kozigegysegek/006f6e6b32303139232d"
 *       },
 *       "szavazokorCime": "Batthyány utca 7. (Veres Péter Gimnázium)",
 *       "akadalymentes": true,
 *       "valasztokerulet": {
 *           "leiras": "Balmazújváros 1. számú EVK",
 *           "szam": 1
 *       },
 *       "valasztokSzama": 1035,
 *       "__v": 1
 *   },
 *   {
 *       "_id": "5e77c3f08723e7a7b25c411b",
 *       "szavazokorSzama": 2,
 *       "kozigEgyseg": {
 *           "megyeNeve": "Hajdú-Bihar",
 *           "kozigEgysegNeve": "Balmazújváros",
 *           "link": "/kozigegysegek/006f6e6b32303139232d"
 *       },
 *       "szavazokorCime": "Batthyány utca 7. (Veres Péter Gimnázium)",
 *       "akadalymentes": true,
 *       "valasztokerulet": {
 *           "leiras": "Balmazújváros 1. számú EVK",
 *           "szam": 1
 *       },
 *       "valasztokSzama": 760,
 *       "__v": 1
 *   },
 * ...
 * ]
 * @apiSampleRequest off
 */


/**
 * @api {get} /szavazokorok/:id? 2.) Egy szavazókör összes adata
 * @apiName szavazokorok
 * @apiGroup Szavazókörök
 *
 * @apiParam {String} id A szavazókör azonosítója az adatbázisban
 * @apiHeader X-Valasztas-Kodja A választási adatbázis kiválasztása (default: `onk2019`)
 * @apiHeader Authorization A regisztrációkor kapott kulcs
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *  
 *{
 *    "_id": "5e77c3f18723e7a7b25c5f72",
 *    "szavazokorSzama": 24,
 *    "kozigEgyseg": {
 *        "megyeNeve": "Somogy",
 *        "kozigEgysegNeve": "Kaposvár",
 *        "kozigEgysegSzavazokoreinekSzama": 59,
 *        "link": "/kozigegysegek/006f6e6b323031393af3"
 *    },
 *    "szavazokorCime": "Búzavirág utca 21. (Kinizsi Lakótelepi Tagiskola",
 *    "akadalymentes": true,
 *    "valasztokSzama": 1345,
 *    "valasztokerulet": {
 *        "leiras": "Kaposvár 2. számú EVK",
 *        "szam": 2
 *    },
 *    "kozteruletek": [
 *        {
 *            "leiras": "Füredi utca 53 - 67 2 2",
 *            "kozteruletNev": "Füredi utca",
 *            "kezdoHazszam": 53,
 *            "vegsoHazszam": 6722,
 *            "megjegyzes": "Páratlan házszámok"
 *        },
 *        {
 *            "leiras": "Kinizsi lakótelep",
 *            "kozteruletNev": "Kinizsi lakótelep",
 *            "kezdoHazszam": 0,
 *            "vegsoHazszam": 9999,
 *            "megjegyzes": "Teljes közterület"
 *        }
 *    ],
 *    "frissitveValasztasHun": "2020-01-09T14:49:48.000Z",
 *    "valasztasHuOldal": "/vhupage/5e77c3f18723e7a7b25c5f72",
 *    "updatedAt": "2020-04-12T07:47:23.094Z",
 *    "__v": 1
 *}
 * 
 * 
 * @apiSampleRequest off
 */

/**
 * @api {get} /szavazokorok?param={value|query} 3.) Szavazókörök keresése paraméter alapján
 * @apiName szavazokorok3
 * @apiGroup Szavazókörök
 *
 * @apiParam {String|Regex} [textFields] Szöveget tartalmazó mezők. (pl: megyenév: `kozigEgyseg.megyeNeve`, település vagy budapesti kerület neve: `kozigEgyseg.kozigEgysegNeve`, szavazókör címe: `szavazokorCime`, a szavazókörhöz tartozó utcák, terek stb nevei: `kozteruletek.kozteruletNev`). Lekérdezhetőek teljes egyezésre (pl: `kozigEgyseg.kozigEgysegNeve=Barcs`) vagy reguláris kifejezéssel (regexel) (pl. `kozteruletek.kozteruletNev=/^hunyadi/i`)
 * @apiParam {Number|Query} [numericFields] Numberikus mezők (pl: a szavazókör száma: `szavazokorSzama`, a szavazókörbe tartozó legkisebb házszám egy adott közterületen: `kozteruletek.kezdoHazszam`, a szavazókörbe tartozó legnagyobb házszám: `kozteruletek.vegsoHazszam`, a szavazókör névjegyzékében szereplők száma: `valasztokSzama` stb). Lekérdezhető pontos egyezésre (pl. `szavazokorSzama=4`) illetve operátorok használhatók, mint: `kozteruletek.kezdoHazszam={ $lt: 22 }`, azaz a kezdő házszám kisebb, mint 22. A következő operátorok használhatók: `$gt`, `$gte`, `$lt`, `$lte`, `$eq`, `$ne`;
 * @apiParam {Number} [limit] Csak a megadott számú találatot adja vissza (default `20`)
 * 
 * @apiHeader X-Valasztas-Kodja A választási adatbázis kiválasztása (default: `onk2019`)
 * @apiHeader Authorization A regisztrációkor kapott kulcs
 *
 * @apiExample {curl} Example usage:
 *   curl --location --request GET 'http://api.tisztaszavazas.hu/szavazokorok?\
 *     kozigEgyseg.kozigEgysegNeve=/Hajd%C3%BAhadh%C3%A1z/&\
 *     kozteruletek.kozteruletNev=/Bercs%C3%A9nyi/&\
 *     kozteruletek.kezdoHazszam={%20$lte:%2022%20}&\
 *     kozteruletek.vegsoHazszam={%20$gt:%2022%20}&\
 *     kozteruletek.megjegyzes=P%C3%A1ros%20h%C3%A1zsz%C3%A1mok' \
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


const DEFAULT_LIMIT = 20;
const DEFAULT_SORT = 'kozigEgyseg.megyeKod,kozigEgyseg.telepulesKod,szavazokorSzama'

const router = express.Router()

router.all('*', authorization)

let Szavazokor, db;

router.all('*', (req, res, next) => { 
  db = req.headers['x-valasztas-kodja'] || 'onk2019'
  Szavazokor = SzavazokorSchemas[`Szavazokor_${db}`]
  if (!Szavazokor){
    res.status(400)
    res.json({'error': `Hibás választás kód: '${db}'` })
    return
  }
  next()
})

const getSzavazokorCount = async ({ megyeKod, telepulesKod }) => {
  const count = await Szavazokor.aggregate([
    { $match: {
      'kozigEgyseg.megyeKod': megyeKod,
      'kozigEgyseg.telepulesKod': telepulesKod
    }},
    { $count: 'kozigEgysegSzavazokoreinekSzama' }
  ])
  return count && count[0] && count[0].kozigEgysegSzavazokoreinekSzama
}


router.get('/:SzavazokorId?', async (req, res) => {
  let {
    params: { SzavazokorId },
    query
  } = req;

  let limit, projection, sort, skip, totalCount;

  query = parseQuery(query)

  ;({ limit = DEFAULT_LIMIT, skip = 0, sort = DEFAULT_SORT, ...query } = query)

  sort = getSortObject(sort)

  try {
    let result;
    if (SzavazokorId) {
      projection = getProjection(req.user, 'byId')
      totalCount = 1

      result = await Szavazokor.findById(SzavazokorId, projection)

      const { kozigEgyseg: { megyeKod, telepulesKod } } = result

      const kozigEgysegSzavazokoreinekSzama = await getSzavazokorCount({ megyeKod, telepulesKod })

      result = mapIdResult(result, db, kozigEgysegSzavazokoreinekSzama)

    } else if (!Object.keys(query).length) {
      projection = getProjection(req.user, 'noQuery')
      totalCount = await Szavazokor.estimatedDocumentCount()
      result = await Szavazokor.find({}, projection).sort(sort).skip(skip).limit(limit)
      result = mapQueryResult(result, query, db)
    } else {
      
      const [filterCond, regexStreetToFilter] = getSzkAggregationFilter(query);

      if (filterCond && filterCond.length){
        projection = {
          _id: 1,
          kozteruletek: {
            $filter: {
              input: '$kozteruletek',
              as: 'kozteruletek',
              cond: {
                $and: filterCond
              }
            }
          },
          ...getProjection(req.user, 'filterStreet')
        }
      } else if (regexStreetToFilter) {
        projection = getProjection(req.user, 'withRegex')
      } else {
        projection = getProjection(req.user, 'withQuery')       
      }

      Object.keys(query).forEach(key => {
        if (projection[key] === 0) delete projection[key]
      })      

      const aggregations = [
        { $match: query },
        { $project: projection },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
      ];

      ;([{ result, totalCount }] = await Szavazokor.aggregate([{
        $facet: {
          result: aggregations,
          totalCount: [{ $match: query },{ $count: 'totalCount' }] }
      }]))

      totalCount = totalCount && totalCount[0] && totalCount[0].totalCount

      if (!totalCount) result = []

      result = reduceResultByRegex(result, regexStreetToFilter, projection)

      if (regexStreetToFilter && totalCount <= limit){
        totalCount = result.length
      } else if (regexStreetToFilter){
        totalCount = undefined
      }

      let szkSzamIfLengthOne;
      
      if (result.length === 1) {
        const { megyeKod, telepulesKod } = result[0].kozigEgyseg;
        szkSzamIfLengthOne = await getSzavazokorCount({ megyeKod, telepulesKod })
      }

      result = mapQueryResult(result, query, db, szkSzamIfLengthOne)
    }

    res.header('X-Total-Count', totalCount)
    res.status(result.length ? 200 : 404)
    res.json(result || 'Szavazokor not found')
  } catch(error) {
    console.log(error)
    res.json({ error: error.message })
  }
})

export default router;