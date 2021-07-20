import express from 'express';
import Szavazokor from '../schemas/Szavazokor';
import generateVhuUrl from '../functions/generateVhuUrl';
import parseQuery from '../functions/parseQuery';
import completeQueryParams from '../functions/completeQueryParams';
import getSortObject from '../functions/getSortObject';

const DEFAULT_LIMIT = 99999;
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
  const isAdmin = roles.includes('admin')

  let projection = {
    sourceHtmlUpdated: 0,
    parsedFromSrcHtml: 0,
    createdAt: 0,
    vhuUrl: 0,
    'kozigEgyseg.megyeKod': 0,
    'kozigEgyseg.telepulesKod': 0,
    polygonUrl: 0,
    valasztasAzonosito: 0
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

router.get('/:SzavazokorId?', async (req, res) => {
  let {
    params: { SzavazokorId },
    query
  } = req;

  let limit, projection, sort;

  query = completeQueryParams(query)
  query = parseQuery(query)
  ;({ limit = DEFAULT_LIMIT, sort = DEFAULT_SORT, ...query } = query)

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
      result = await Szavazokor.find({}, projection).sort(sort).limit(limit)
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

router.post('/', async (req, res) => {
  if (!req.user.roles.includes('admin')) res.sendStatus(404);
  let { body } = req;

  body = Array.isArray(body) ? body : [ body ];
  body = body.map(szavazokor => ({ ...szavazokor, ...getGeneratedParams(szavazokor) }))
  try {
    const insertedRecords = await Szavazokor.insertMany(body)
    res.json(insertedRecords)
  } catch(error){
    res.json({ error: error.message })
  }
})



export default router;