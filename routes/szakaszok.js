import express from 'express';
import Szakasz from '../schemas/Szakasz';
import parseQueryValue from '../functions/parseQueryValue';

const DEFAULT_LIMIT = 9999999;

const router = express.Router()

router.get('/:SzakaszId?', async (req, res) => {
  let {
    params: { SzakaszId },
    query: { limit = DEFAULT_LIMIT, ...query }
  } = req;

  try {
    let result;
    if (SzakaszId) {
      result = await Szakasz.findById(SzakaszId)
    } else {
      query = Object.entries(query).reduce((acc, [key, value]) => ({
        ...acc, [key]: parseQueryValue(value)
      }), {})

      console.log(query)

      result = await Szakasz.find(query).limit(+limit)
    }
    res.status(result ? 200 : 400)
    res.json(result || 'Szakasz not found')
  } catch(error) {
    res.json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  let { body } = req;

  body = Array.isArray(body) ? body : [ body ];

  try {
    const insertedRecords = await Szakasz.insertMany(body)
    res.json(insertedRecords)
  } catch(error){
    res.json({ error: error.message })
  }
})

export default router;