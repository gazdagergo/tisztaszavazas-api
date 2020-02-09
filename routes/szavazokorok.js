import express from 'express';
import Szavazokor from '../schemas/Szavazokor';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router()

router.get('/:SzavazokorId?', async (req, res) => {
  const {
    params: { SzavazokorId },    
    query:  { megyeKod, telepulesKod, szavkorSorszam }
  } = req;

  try {
    let result;
    if (SzavazokorId) {
      result = await Szavazokor.findById(SzavazokorId)
    } else {
      result = await Szavazokor.find({
        szavkorSorszam: +szavkorSorszam,
        'telepules.telepulesKod': +telepulesKod,
        'telepules.megyeKod': +megyeKod
      })
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