import express from 'express';
import SzavazokorSchemas from '../schemas/Szavazokor';
import parseQuery from '../functions/parseQuery';
import getSortObject from '../functions/getSortObject';
import authorization from '../middlewares/authorization';
import getSzkAggregationFilter from '../functions/getSzkAggregationFilter';
import getProjection from '../functions/getProjection';


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
 *  HTTP/1.1 200 OK
 *   [
 *     {
 *        "_id": "5e77c3f08723e7a7b25c40b0",
 *        "kozigEgyseg": {
 *          "megyeNeve": "Hajdú-Bihar",
 *          "kozigEgysegNeve": "Esztár",
 *          "egySzavazokorosTelepules": true
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
 * @api {get} /szavazokorok/:id? 2.) Egy szavazókör összes adata
 * @apiName szavazokorok
 * @apiGroup Szavazókörök
 *
 * @apiParam {String} id A szavazókör azonosítója az adatbázisban
 * @apiHeader X-Valasztas-Kodja A választási adatbázis kiválasztása (default: `onk2019`)
 * @apiHeader Authorization A regisztrációkor kapott kulcs
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "_id": "5e77c3f18723e7a7b25c5f72",
 *    "szavazokorSzama": 24,
 *    "kozigEgyseg": {
 *        "megyeNeve": "Somogy",
 *        "kozigEgysegNeve": "Kaposvár",
 *        "egySzavazokorosTelepules": false
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
 * @api {get} /szavazokorok?param={value|query} 3.) Szavazókörök keresése paraméter alapján
 * @apiName szavazokorok3
 * @apiGroup Szavazókörök
 *
 * @apiParam {String|Regex} kozigEgysegNeve A település vagy budapesti kerület neve
 * @apiParam {String|Regex} kozteruletNev A szavazó lakcíme közterületének neve (pl: Bercsényi utca v. /bercs/i)
 * @apiParam {Number|Query} kezdoHazszam A közterület szavazókörhöz tartozó legkisebb házszáma. Lekéréskor relációk használhatók, mint { $lt: 22 }, vagyis 22-nél kisebb
 * @apiParam {Number|Query} vegsoHazszam A közterület szavazókörhöz tartozó legmagasabb házszáma. Lekéréskor relációk használhatók, mint { $gte: 22 }, vagyis 22-nél nagyobb vagy egyenlő
 * @apiParam {Number} limit Csak a megadott számú találatot adja vissza (default `20`)
 * 
 * @apiHeader X-Valasztas-Kodja A választási adatbázis kiválasztása (default: `onk2019`)
 * @apiHeader Authorization A regisztrációkor kapott kulcs
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
 *             "kozigEgysegNeve": "Hajdúhadház",
 *             "egySzavazokorosTelepules": false
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

let Szavazokor;

router.all('*', (req, res, next) => { 
  const db = req.headers['x-valasztas-kodja'] || 'onk2019'
  Szavazokor = SzavazokorSchemas[`Szavazokor_${db}`]
  if (!Szavazokor){
    res.status(400)
    res.json({'error': `Hibás választás kód: '${db}'` })
    return
  }
  next()
})

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
      result = {
        ...result['_doc'],
        valasztasHuOldal: `${process.env.BASE_URL}/vhupage/${result['_doc']['_id']}`
      }
    } else if (!Object.keys(query).length) {
      projection = getProjection(req.user, 'noQuery')
      totalCount = await Szavazokor.estimatedDocumentCount()
      result = await Szavazokor.find({}, projection).sort(sort).skip(skip).limit(limit)
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
        projection = getProjection(req.user, 'noQuery')
      }

      const aggregations = [
        { $match: query },
        { $project: projection },
        { $skip: skip },
        { $limit: limit },
      ];

      ;([{ result, totalCount: [ { totalCount }] }] = await Szavazokor.aggregate([{
        $facet: {
          result: aggregations,
          totalCount: [{ $match: query },{ $count: 'totalCount' }] }
      }]))
      
      result = result.reduce((acc = [], entry) => {
        if (!entry.kozteruletek || !entry.kozteruletek.length) return [...acc, entry]
        const kozteruletek = entry.kozteruletek.filter(({ kozteruletNev }) => (
          kozteruletNev.match(regexStreetToFilter)  // default: '' -> matches with all
        ))
        const { _id, kozteruletek: kt, ...entryRest } = entry;
        if (kozteruletek.length) return [...acc, { _id, kozteruletek, ...entryRest }]
        return acc
      }, [])
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