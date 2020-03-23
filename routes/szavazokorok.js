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
          szavazokorSzama: 1,
          kozigEgyseg: 1
        }})
      } else {
        aggregations.push({ $project: {
          polygonUrl: 0,
          vhuUrl: 0
        }})
      }

      result = await Szavazokor.aggregate(aggregations)

      if (regexStreetToFilter) {
        result = result.reduce((acc = [], entry) => {
          const kozteruletek = entry.kozteruletek.filter(({ kozteruletNev }) => (
            kozteruletNev.match(regexStreetToFilter)
          ))
          if (kozteruletek.length) return [...acc, { ...entry, kozteruletek }]
          return acc
        }, [])
      }
    }
    res.status(result.length ? 200 : 404)
    res.json(result || 'Szavazokor not found')
  } catch(error) {
    console.log(error)
    res.json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
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