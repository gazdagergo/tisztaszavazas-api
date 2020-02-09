import express from 'express';
import Szavazokor from '../../schemas/Szavazokor';
import dotenv from 'dotenv';
import getHtml from './getHtml';
import parse from './parse';
import generateVhuUrl from '../../functions/generateVhuUrl';

dotenv.config();

const router = express.Router()

router.get('/:SzavazokorId?', async (req, res) => {
  const {
    params: { SzavazokorId }
  } = req;

  try {
    const szkData = await Szavazokor.findById(SzavazokorId)
    const { szavkorSorszam,
      telepules: {
        telepulesKod,
        megyeKod
      }
    } = szkData;
    const url = generateVhuUrl(megyeKod, telepulesKod, szavkorSorszam)
    const html = await getHtml(url)
    const { kozteruletek } = await parse(html)
    res.json({...szkData['_doc'], kozteruletek})
  } catch (error) {
    console.log(error)
    res.status(500)
    res.json({ error: error.message })    
  }
})

export default router;