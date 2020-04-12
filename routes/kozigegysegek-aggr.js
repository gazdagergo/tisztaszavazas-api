import express from 'express';
import getSortObject from '../functions/getSortObject';
import parseQuery from '../functions/parseQuery';
import authorization from '../middlewares/authorization';
import SzavazokorSchemas from '../schemas/Szavazokor';
import { encodeHex, pad } from '../functions/stringFunctions';

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
    megyeKod: 0,
    telepulesKod: 0
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
  return id
}

router.all('*', authorization)

let Szavazokor;

router.all('*', (req, res, next) => { 
  const db = req.headers['x-valasztas-kodja'] || 'onk2019'
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
      const megyeKod = +id.slice(-5,-3)
      const telepulesKod = +id.slice(2)
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
        kozteruletek: addKozteruletLinks(result.kozteruletek, result.kozigEgysegNeve),
        szavazokorok: result.szavazokorok.map(({ _id, szavazokorSzama }) => ({
          szavazokorSzama,
          link: `/szavazokorok/${_id}`
        })),
      }

      // result = result && result[0] && result[0].kozteruletek

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
        { $skip: skip },
        { $limit: limit }      
      ]

      ;([{ result, totalCount }] = await Szavazokor.aggregate([
        { $facet: {
          result: aggregation,
          totalCount: [
            { $group: group },
            { $unwind: '$kozigEgyseg' },
            { $count: 'totalCount' }]
        }
      }]))

      totalCount = totalCount && totalCount[0] && totalCount[0].totalCount

      result = result.map(({ _id, megyeNeve, kozigEgysegNeve, kozigEgysegSzavazokoreinekSzama }) => ({
        _id,
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
