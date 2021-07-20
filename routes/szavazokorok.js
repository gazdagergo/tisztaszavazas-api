import express from 'express';
import Szavazokor from '../schemas/Szavazokor';
import generateVhuUrl from '../functions/generateVhuUrl';
import parseQuery from '../functions/parseQuery';

const DEFAULT_LIMIT = 99999;

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
  switch (context) {
    case 'noQuery': return ({
      kozteruletek: 0,
      sourceHtmlUpdated: 0,
      frissitveValasztasHun: 0,
      parsedFromSrcHtml: 0,
      vhuUrl: 0,
      polygonUrl: 0,
      createdAt: 0,
      egySzavazokorosTelepules: 0,
      'kozigEgyseg.megyeKod': 0,
      'kozigEgyseg.telepulesKod': 0
    })

    case 'filterStreet': return ({
      szavazokorSzama: 1,
      'kozigEgyseg.kozigEgysegNeve': 1,
      'kozigEgyseg.megyeNeve': 1
    })

    default: return ({
      sourceHtmlUpdated: roles.includes('admin') ? 1 : 0,
      parsedFromSrcHtml: roles.includes('admin') ? 1 : 0,
      createdAt: roles.includes('admin') ? 1 : 0,
      'kozigEgyseg.megyeKod': roles.includes('admin') ? 1 : 0,
      'kozigEgyseg.telepulesKod': roles.includes('admin') ? 1 : 0,
    })
  }
}

router.get('/:SzavazokorId?', async (req, res) => {
  let {
    params: { SzavazokorId },
    query: { limit = DEFAULT_LIMIT, ...query }
  } = req;

  try {
    let result;
    if (SzavazokorId) {
      result = await Szavazokor.findById(SzavazokorId)
      result = {
        ...result['_doc'],
        scrapeUrl: `${process.env.BASE_URL}/scrape/${result['_doc']['_id']}`
      }
    } else if (!Object.keys(query).length) {
      const projection = getProjection(req.user, 'noQuery')
      result = await Szavazokor.find({}, projection).limit(limit)
    } else {
      query = parseQuery(query)

      let [_, filterCond] = Object.entries(query).reduce(
        (acc, [key, value]) => {
          if (key.includes('kozteruletek')){
            return [ acc[0], { ...acc[1], [key]: value } ]
          }
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
        aggregations.push({ $project: getProjection(req.user, 'default') })
      }

      result = await Szavazokor.aggregate(aggregations)
      
      result = result.reduce((acc = [], entry) => {
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