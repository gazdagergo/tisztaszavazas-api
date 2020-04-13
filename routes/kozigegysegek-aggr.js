import express from 'express';
import getSortObject from '../functions/getSortObject';
import parseQuery from '../functions/parseQuery';
import authorization from '../middlewares/authorization';
import SzavazokorSchemas from '../schemas/Szavazokor';
import { encodeHex, pad } from '../functions/stringFunctions';


/**
* @api {get} /kozigegysegek/ 1.) Összes közigazgatási egység
* @apiName kozigegysegek2
* @apiGroup Közigegységek
*
* @apiParam {Number} limit Csak a megadott számú találatot adja vissza (default `20`)
* @apiHeader X-Valasztas-Kodja A választási adatbázis kiválasztása (default: `onk2019`)
* @apiHeader Authorization A regisztrációkor kapott kulcs
*
* @apiSuccessExample {json} Success-Response:
*  HTTP/1.1 200 OK
*  [
*    {
*      "_id": "006f6e6b3230313903f2",
*      "megyeNeve": "Budapest",
*      "kozigEgysegNeve": "Budapest X.ker",
*      "kozigEgysegSzavazokoreinekSzama": 76
*    },
*    {
*      "_id": "006f6e6b3230313903f3",
*      "megyeNeve": "Budapest",
*      "kozigEgysegNeve": "Budapest XI.ker",
*      "kozigEgysegSzavazokoreinekSzama": 115
*    },
* 		...
*   ]
* @apiSampleRequest off
*/

/**
 * @api {get} /kozigegysegek/:id? 2.) Egy közigazgatási egység összes adata
 * @apiName kozigegysegek3
 * @apiGroup Közigegységek
 *
 * @apiParam {String} id A közigazgatási egység azonosítója az adatbázisban
 * @apiHeader X-Valasztas-Kodja A választási adatbázis kiválasztása (default: `onk2019`)
 * @apiHeader Authorization A regisztrációkor kapott kulcs
 *  
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  
 * {
 *   "_id": "006f6e6b3230313903f2",
 *   "megyeNeve": "Budapest",
 *   "kozigEgysegNeve": "Budapest X.ker",
 *   "kozigEgysegSzavazokoreinekSzama": 76,
 *   "szavazokorok": [
 *     {
 *       "szavazokorSzama": 1,
 *       "link": "/szavazokorok/5e77c3f08723e7a7b25c47c6"
 *     },
 *     {
 *       "szavazokorSzama": 2,
 *       "link": "/szavazokorok/5e77c3f08723e7a7b25c47c7"
 *     },
 *   ...
 *     {
 *       "szavazokorSzama": 76,
 *       "link": "/szavazokorok/5e77c3f08723e7a7b25c47c9"
 *     }
 *   ],
 *   "kozteruletek": [
 *     {
 *       "kozteruletNev": "Agyagfejtő utca",
 *       "kozteruletSzavazokorei": "/szavazokorok?kozigEgyseg.kozigEgysegNeve=Budapest%20X.ker&kozteruletek.kozteruletNev=Agyagfejt%C5%91%20utca"
 *     },
 *     {
 *       "kozteruletNev": "Akna utca",
 *       "kozteruletSzavazokorei": "/szavazokorok?kozigEgyseg.kozigEgysegNeve=Budapest%20X.ker&kozteruletek.kozteruletNev=Akna%20utca"
 *     },
 *  ...
 * }
 * 
 * @apiSampleRequest off
 */

const router = express.Router();

const DEFAULT_LIMIT = 20;
const DEFAULT_SORT = 'megyeKod,telepulesKod'

const addKozteruletLinks = (kozteruletek, kozigEgysegNeve) => {
  if (kozteruletek && kozteruletek.map) {
    return kozteruletek.map(kozterulet => ({
      ...kozterulet,
      kozteruletSzavazokorei: `/szavazokorok?kozigEgyseg.kozigEgysegNeve=${encodeURIComponent(kozigEgysegNeve)}&kozteruletek.kozteruletNev=${encodeURIComponent(kozterulet.kozteruletNev)}`
    }))
  }

  return kozteruletek
}

const getProjection = ({ roles }, context) => {
  const isAdmin = roles && roles.includes('admin');

  let projection = {
  }

  switch (context) {
    case 'byId':
      return projection;
    case 'byQuery':
      projection = { ...projection, kozteruletek: 0 }
      return projection
    default:
      return projection
  }
}

export const generateKozigEgysegId = ({ megyeKod, telepulesKod }, db) => {
  let id = (+megyeKod * 1000 + telepulesKod).toString(16);
  id = pad(encodeHex(db), 16) + pad(id, 4)
  id = `5e77${id}`
  return id
}

router.all('*', authorization)

let Szavazokor, db;

router.all('*', (req, res, next) => { 
  db = req.headers['x-valasztas-kodja'] || 'onk2019'
  Szavazokor = SzavazokorSchemas[`Szavazokor_${db}`]
  if (!Szavazokor){
    res.status(400)
    res.json({'error': `Hibás választás kód...: '${db}'` })
    return
  }
  next()
})

router.get('/:id?', async (req, res) => {
  try {
    let {
      params: { id },
      query
    } = req;

    let limit, sort, skip, result, totalCount, aggregation, projection, group;
    query = parseQuery(query)
    ;(
      {
        limit = DEFAULT_LIMIT,
        skip = 0,
        sort = DEFAULT_SORT,
        ...query
      } = query
    )

    sort = getSortObject(sort)

    if (id) {
      let parsedId = id.toString().slice(-4)
      parsedId = parseInt(parsedId, 16)

      const megyeKod = +parsedId.toString().slice(-5,-3)
      const telepulesKod = +parsedId.toString().slice(-3)

      query = { 'kozigEgyseg.megyeKod': megyeKod, 'kozigEgyseg.telepulesKod': telepulesKod }
      projection = getProjection(req.user, 'byId')
      group = {
        _id: 'a',
        kozteruletek: {
        $addToSet: {
          kozteruletNev: '$kozteruletNev'
        }
      } }

      const kozigEgysegAggregation = [
        { $match: query },
        { $group: {
          _id: null,
          kozigEgyseg: {
            $addToSet: {
              kozigEgyseg: '$kozigEgyseg'
            }
          }
        }}
      ]

      const kozterulatAggregation = [
        { $match: query },
        { $unwind: "$kozteruletek" },
        { $replaceRoot: { newRoot: "$kozteruletek" } },
        { $group: group },
        { $unwind: "$kozteruletek" },
        { $sort: { 'kozteruletek.kozteruletNev':  1 } },
        { $group: {
          "_id": null,
          kozteruletek: { $push: '$kozteruletek' } }
        }
      ]

      const szavazokorAggregation = [
        { $match: query },
        { $project: { szavazokorSzama: 1 }},
        { $sort: { szavazokorSzama: 1 }}
      ]
      
      const szkCountAggregation = [
        { $match: query },
        { $count: 'szkCount' },
      ]   

      result = await Szavazokor.aggregate([
        { $facet: {
          kozigEgyseg: kozigEgysegAggregation,
          kozteruletek: kozterulatAggregation,
          szavazokorok: szavazokorAggregation,
          count: szkCountAggregation
        }},
        { $addFields: {
          megyeNeve: { $arrayElemAt: [ { $arrayElemAt: ['$kozigEgyseg.kozigEgyseg.kozigEgyseg.megyeNeve', 0 ] }, 0 ] },
          kozigEgysegNeve: { $arrayElemAt: [ { $arrayElemAt: ['$kozigEgyseg.kozigEgyseg.kozigEgyseg.kozigEgysegNeve', 0 ] }, 0 ] },
          kozteruletek:  { $arrayElemAt: ['$kozteruletek.kozteruletek', 0 ] },
          szavazokorok: '$szavazokorok',
          count: '$count'
        }},
        { $project: { kozigEgyseg: 0 }}
      ])

      result = result[0]

      if (!result.count[0]) {
        throw Error(`KozigEgyseg with id '${id}' does not exists`)
      }

      result = {
        _id: id,
        megyeNeve: result.megyeNeve,
        kozigEgysegNeve: result.kozigEgysegNeve,
        kozigEgysegSzavazokoreinekSzama: result.count[0].szkCount,
        szavazokorok: result.szavazokorok.map(({ _id, szavazokorSzama }) => ({
          szavazokorSzama,
          link: `/szavazokorok/${_id}`
        })),
        kozteruletek: addKozteruletLinks(result.kozteruletek, result.kozigEgysegNeve),
      }

      totalCount = 1;
    } else {
      projection = getProjection(req.user, 'byQuery')

      group = {
        _id: { $add: [
          { $multiply: [ '$kozigEgyseg.megyeKod', 1000 ] },
          '$kozigEgyseg.telepulesKod',
        ] },
        kozigEgyseg: {
          $addToSet: {
            kozigEgyseg: '$kozigEgyseg'
          }
        },
        kozigEgysegSzavazokoreinekSzama: { $sum: 1 }        
      }

      aggregation = [
        { $group: group },
        { $unwind: '$kozigEgyseg' },
        { $addFields: {
          megyeKod: '$kozigEgyseg.kozigEgyseg.megyeKod',
          telepulesKod: '$kozigEgyseg.kozigEgyseg.telepulesKod',
          megyeNeve: '$kozigEgyseg.kozigEgyseg.megyeNeve',
          kozigEgysegNeve: '$kozigEgyseg.kozigEgyseg.kozigEgysegNeve',
        }},
        { $sort: sort },
        { $project: {
          kozigEgyseg: 0,
          ...projection
        }},
        { $match: query },
     
      ]

      const aggregationPaginated = [
        ...aggregation,
        { $skip: skip },
        { $limit: limit }
      ]

      const aggregationCounted = [
        ...aggregation,
        { $count: 'totalCount' }
      ]

      ;([{ result, totalCount }] = await Szavazokor.aggregate([
        { $facet: {
          result: aggregationPaginated,
          totalCount: aggregationCounted
        }
      }]))

      totalCount = totalCount && totalCount[0] && totalCount[0].totalCount

      result = result.map(({ megyeKod, telepulesKod, megyeNeve, kozigEgysegNeve, kozigEgysegSzavazokoreinekSzama }) => ({
        _id: generateKozigEgysegId({ megyeKod, telepulesKod }, db),
        megyeNeve,
        kozigEgysegNeve,
        kozigEgysegSzavazokoreinekSzama,
      }))      
    }
    
    res.header('X-Total-Count', totalCount)  
    res.json(result);
  } catch (error) {
    res.status(404);
    res.json({ error: error.message })
  }
});

export default router;
