import express from 'express';
import Szavazokor from '../schemas/Szavazokor';
import dotenv from 'dotenv';
import { toRegex, toNumeric, toBoolean } from '../utils';
import generateVhuUrl from '../functions/generateVhuUrl';


dotenv.config();

const DEFAULT_LIMIT = 99999;

const parseQueryValue = value => {
  let parsed = toBoolean(value); if (parsed !== null) return parsed;
  parsed = toNumeric(value); if (parsed !== null) return parsed;
  parsed = toRegex(value); if (parsed !== null) return parsed;
  return value
}


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

router.put('/:SzavazokorId?', async (req, res) => {
  const {
    headers, 
    body,
    query
  } = req;

  if (headers.apikey !== process.env.APIKEY) {
    res.status(403);
    return res.json({ error: 'missing or bad apikey'})
  }
  
  try {
    const updatedRecord = await Szavazokor.updateOne(
      query,
      { $set: body }
    )
    res.json(updatedRecord)
  } catch(error){
    res.json({ error: error.message })
  }
})


export default router;