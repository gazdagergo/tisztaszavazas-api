import express from 'express';
import Szavazokor from '../schemas/Szavazokor';
import generateVhuUrl from '../functions/generateVhuUrl';
import parseQueryValue from '../functions/parseQueryValue';

const DEFAULT_LIMIT = 99999;

const router = express.Router()

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
        scrapeUrl: `${process.env.BASE_URL}/scrape/${result['_doc']['_id']}`,
        vhuUrl: generateVhuUrl(
          result.kozigEgyseg.megyeKod, 
          result.kozigEgyseg.telepulesKod, 
          result.szavkorSorszam
        )
      }
    } else {
      query = Object.entries(query).reduce((acc, [key, value]) => ({
        ...acc, [key]: parseQueryValue(value)
      }), {})

      console.log(query)

      result = await Szavazokor.find(query).limit(+limit)
      result = result.map(szk => ({
        ...szk['_doc'],
        scrapeUrl: `${process.env.BASE_URL}/scrape/${szk['_doc']['_id']}`,
        vhuUrl: generateVhuUrl(
          szk.kozigEgyseg.megyeKod, 
          szk.kozigEgyseg.telepulesKod, 
          szk.szavkorSorszam
        )
      }))
    }
    res.status(result ? 200 : 400)
    res.json(result || 'Szavazokor not found')
  } catch(error) {
    res.json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  let { body } = req;

  body = Array.isArray(body) ? body : [ body ];

  try {
    const insertedRecords = await Szavazokor.insertMany(body)
    res.json(insertedRecords)
  } catch(error){
    res.json({ error: error.message })
  }
})



export default router;