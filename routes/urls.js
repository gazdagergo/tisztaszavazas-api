import express from 'express';
import Schema from '../schemas/SzavazokorUrl';

const DEFAULT_LIMIT = 99999;

const router = express.Router()

router.get('/:id?', async (req, res) => {
  let {
    params: { id },
    query: { limit = DEFAULT_LIMIT, ...query }
  } = req;


  try {
    let result;
    if (id) {
      result = await Schema.findById(id)
    } else {
      result = await Schema.find(query)
    }

    res.status(result.length ? 200 : 404)
    res.json(result || 'Not found')
  } catch(error) {
    console.log(error)
    res.json({ error: error.message })
  }
})

export default router;