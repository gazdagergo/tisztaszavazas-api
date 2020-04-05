import express from 'express';
import SzavazokorSchemas from '../schemas/Szavazokor';
import generateVhuUrl from '../functions/generateVhuUrl';
import parseQuery from '../functions/parseQuery';
import completeQueryParams from '../functions/completeQueryParams';
import getSortObject from '../functions/getSortObject';
import authorization from '../middlewares/authorization';


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

const getGeneratedParams = szavazokor => {
  const query = {
    'kozigEgyseg.megyeKod': szavazokor.kozigEgyseg.megyeKod,
    'kozigEgyseg.telepulesKod': szavazokor.kozigEgyseg.telepulesKod,
    szavazokorSzama: szavazokor.szavazokorSzama
  }
  return {
    vhuUrl: generateVhuUrl(query),
    polygonUrl: generateVhuUrl({ ...query, context: 'polygon' })
  }
}

const instanceOf = (elem, constructorName = 'Object') => (
  elem instanceof Object &&
  Object.getPrototypeOf(elem).constructor.name == constructorName
)

const getProjection = ({ roles }, context) => {
  const isAdmin = roles && roles.includes('admin')

  let projection = {
    sourceHtmlUpdated: 0,
    parsedFromSrcHtml: 0,
    createdAt: 0,
    vhuUrl: 0,
    'kozigEgyseg.megyeKod': 0,
    'kozigEgyseg.telepulesKod': 0,
    polygonUrl: 0,
    valasztasAzonosito: 0,
    helyadatok: 0
  }

  switch (context) {
    case 'withQuery':
    case 'noQuery': return ({
      kozteruletek: 0,
      sourceHtmlUpdated: 0,
      frissitveValasztasHun: 0,
      parsedFromSrcHtml: 0,
      vhuUrl: 0,
      polygonUrl: 0,
      createdAt: 0,
      updatedAt: 0,
      egySzavazokorosTelepules: 0,
      'kozigEgyseg.megyeKod': 0,
      'kozigEgyseg.telepulesKod': 0,
      valasztasAzonosito: 0,
      helyadatok: 0
    })

    case 'filterStreet': return ({
      szavazokorSzama: 1,
      'kozigEgyseg.kozigEgysegNeve': 1,
      'kozigEgyseg.megyeNeve': 1
    })

    default:
      if (isAdmin) {
        delete projection['kozigEgyseg.megyeKod']
        delete projection['kozigEgyseg.telepulesKod']
        delete projection.polygonUrl
      }
      return projection
  }
}

router.all('*', authorization)

let Szavazokor;

router.all('*', (req, _res, next) => { 
  const db = req.headers['x-valasztas-kodja'] || 'onk2019'
  Szavazokor = SzavazokorSchemas[`Szavazokor_${db}`]
  next()
})


router.get('/:SzavazokorId?', async (req, res) => {
  let {
    params: { SzavazokorId },
    query
  } = req;

  let limit, projection, sort, skip;

  query = completeQueryParams(query)
  query = parseQuery(query)
  ;({ limit = DEFAULT_LIMIT, skip = 0, sort = DEFAULT_SORT, ...query } = query)

  sort = getSortObject(sort)

  try {
    let result;
    if (SzavazokorId) {
      projection = getProjection(req.user, 'byId')
      result = await Szavazokor.findById(SzavazokorId, projection)
      result = {
        ...result['_doc'],
        valasztasHuOldal: `${process.env.BASE_URL}/vhupage/${result['_doc']['_id']}`
      }
    } else if (!Object.keys(query).length) {
      projection = getProjection(req.user, 'noQuery')
      result = await Szavazokor.find({}, projection).sort(sort).limit(limit).skip(skip)
    } else {
      let [_, filterCond] = Object.entries(query).reduce(
        (acc, [key, value]) => {
          if (key.includes('kozteruletek')){
            return [ acc[0], { ...acc[1], [key]: value } ]
          }

          projection = getProjection(req.user, 'withQuery')
          return [ {...acc[0], [key]: value }, acc[1] ]
        },
        [{}, {}] 
      )

      let regexStreetToFilter = '';

      filterCond = Object.entries(filterCond).reduce((acc = [], [key, value]) => {
        if (instanceOf(value, 'Object')) {
          const [operator, value2] = Object.entries(value)[0]
          return [...acc, { [operator]: [ `$$${key}`, value2 ]  }]
        }
        if (instanceOf(value, 'RegExp')) {
          regexStreetToFilter = value
          return acc
        }
        return [...acc, { $eq: [ `$$${key}`, value ]  }]
      }, [])

      const aggregations = [{ $match: query }];

      if (filterCond && filterCond.length){
        aggregations.push({ $project: {
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
        }})
      } else {
        aggregations.push({ $project: getProjection(req.user, 'withQuery') })
      }

      result = await Szavazokor.aggregate(aggregations)
      
      result = result.reduce((acc = [], entry) => {
        if (!entry.kozteruletek) return [...acc, entry]
        if (entry.egySzavazokorosTelepules) return [...acc, entry]
        const kozteruletek = entry.kozteruletek.filter(({ kozteruletNev }) => (
          kozteruletNev.match(regexStreetToFilter)  // default: '' -> matches with all
        ))
        if (kozteruletek.length) return [...acc, { ...entry, kozteruletek }]
        return acc
      }, [])
    }
    res.header('X-Total-Count', result.length)
    res.status(result.length ? 200 : 404)
    res.json(result || 'Szavazokor not found')
  } catch(error) {
    console.log(error)
    res.json({ error: error.message })
  }
})

export default router;