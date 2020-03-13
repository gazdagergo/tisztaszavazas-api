import express from 'express';
import Kozterulet from '../schemas/Kozterulet';
import parseQueryValue from '../functions/parseQueryValue';

const DEFAULT_LIMIT = 9999999;

const router = express.Router()

router.get('/:KozteruletId?', async (req, res) => {
  let {
    params: { KozteruletId },
    query: { limit = DEFAULT_LIMIT, ...query }
  } = req;

  try {
    let result;
    if (KozteruletId) {
      result = await Kozterulet.findById(KozteruletId)
    } else {
      query = Object.entries(query).reduce((acc, [key, value]) => ({
        ...acc, [key]: parseQueryValue(value)
      }), {})

      console.log(query)

      result = await Kozterulet.find(query).limit(+limit)
    }
    res.status(result ? 200 : 400)
    res.json(result || 'Kozterulet not found')
  } catch(error) {
    res.json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  let { body } = req;

  body = Array.isArray(body) ? body : [ body ];

  try {
    const insertedRecords = await Kozterulet.insertMany(body)
    res.json(insertedRecords)
  } catch(error){
    res.json({ error: error.message })
  }
})

export default router;