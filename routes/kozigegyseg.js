import express from 'express';
import KozigEgyseg from '../schemas/KozigEgyseg';
import parseQuery from '../functions/parseQuery';

const DEFAULT_LIMIT = 9999999;

const router = express.Router()

router.get('/:KozigEgysegId?', async (req, res) => {
  let {
    params: { KozigEgysegId },
    query: { limit = DEFAULT_LIMIT, ...query }
  } = req;

  try {
    let result;
    if (KozigEgysegId) {
      result = await KozigEgyseg.findById(KozigEgysegId)
    } else {
      query = parseQuery(query)
      console.log(query)
      result = await KozigEgyseg.find(query).limit(+limit)
    }
    res.status(result ? 200 : 400)
    res.json(result || 'KozigEgyseg not found')
  } catch(error) {
    res.json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  let { body } = req;

  body = Array.isArray(body) ? body : [ body ];

  try {
    const insertedRecords = await KozigEgyseg.insertMany(body)
    res.json(insertedRecords)
  } catch(error){
    res.json({ error: error.message })
  }
})

export default router;