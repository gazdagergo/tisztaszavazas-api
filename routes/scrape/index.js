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
    query
  } = req;

try {
    const  { megyeKod, telepulesKod, szavkorSorszam } = query;
    const url = generateVhuUrl(megyeKod, telepulesKod, szavkorSorszam)
    console.log(url)
    const html = await getHtml(url)
    const szData = await parse(html)
    res.json(szData)
  } catch(error){
    console.log(error)
    res.status(500)
    res.json({ error: error.message })
  }
})

export default router;