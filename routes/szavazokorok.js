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
    polygonUrl: generateVhuUrl({ ...query, polygon: true })
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
    } else {
      query = parseQuery(query)
      console.log(query)
      result = await Szavazokor.find(query, { kozteruletek: 0 }).limit(+limit)
      result = result.map(szk => ({
        ...szk['_doc'],
        scrapeUrl: `${process.env.BASE_URL}/scrape/${szk['_doc']['_id']}`
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
  body = body.map(szavazokor => ({ ...szavazokor, ...getGeneratedParams(szavazokor) }))
  try {
    const insertedRecords = await Szavazokor.insertMany(body)
    res.json(insertedRecords)
  } catch(error){
    res.json({ error: error.message })
  }
})



export default router;