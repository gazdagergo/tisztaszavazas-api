import express from 'express';
import Szavazokor from '../schemas/Szavazokor';
import dotenv from 'dotenv';
import scrape from '../scrape';
import parse from '../parse';
import generateVhuUrl from '../functions/generateVhuUrl';

dotenv.config();

const router = express.Router()

router.get('/:SzavazokorId?', async (req, res) => {
  const {
    // params: { SzavazokorId },    
    query
  } = req;
  try {
  const url = generateVhuUrl()
  const html = await scrape(url)
  const szData = await parse(html)
  res.json(szData)
  } catch(error){
    console.log(error)
    res.status(500)
    res.json({ error: error.message })
  }

/*
  try {
    const result = SzavazokorId
      ? await Szavazokor.findById(SzavazokorId) 
      : await Szavazokor.find(query)
   
    res.status(result ? 200 : 400)
    res.json(result || 'Szavazokor not found')
  } catch(error) {
    res.json({ error: error.message })
  } */
})

router.post('/', async (req, res) => {
  let { body } = req;
  console.log(body)

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