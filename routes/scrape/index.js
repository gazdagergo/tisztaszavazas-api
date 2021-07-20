import express from 'express';
import Szavazokor from '../../schemas/Szavazokor';
import dotenv from 'dotenv';
import getHtml from './getHtml';
import parse from './parse';
import generateVhuUrl from '../../functions/generateVhuUrl';
import SourceHtml from '../../schemas/SourceHtml';
import parseQuery from '../../functions/parseQuery';

dotenv.config();

const router = express.Router()
let responses = {};

router.get('/:SzavazokorId?', async (req, res) => {
  const {
    params: { SzavazokorId },
    query
  } = req;

  const { scrapeOnly, parseFromDb } = parseQuery(query)

  try {
    const szavkor = await Szavazokor.findById(SzavazokorId)

    const {
      szavkorSorszam,
      kozigEgyseg: {
        telepulesKod,
        megyeKod
      }
    } = szavkor;

    const url = generateVhuUrl(megyeKod, telepulesKod, szavkorSorszam)
    const html = await getHtml(url)

    const htmlUpdateResponse = await SourceHtml.insertMany([{
      megyeKod,
      telepulesKod,
      szavkorSorszam,
      url,
      html
    }])

    responses.htmlUpdateResponse = htmlUpdateResponse[0]
    const { kozteruletek, ...szkParsedData } = await parse(html)
      
    const newSzavkor = Object.assign(szavkor, szkParsedData)

    let szavkorUpdateResponse;
    if (scrapeOnly) {
      szavkorUpdateResponse = 'Szavkor not updated as scrapeOnly flat was true'
    } else {
      szavkorUpdateResponse = await newSzavkor.save()
    }

    responses = {...responses, szavkorUpdateResponse }
    res.json({
      'message': scrapeOnly ? 'sourceHtml refreshed in db' : 'szavazokor updated',
      responses
    })
  } catch (error) {
    console.log(error)
    res.status(500)
    res.json({ error: error.message })    
  }
})

router.post('/', async (req, res) => {
  const { body } = req;
  res.json(body)
})

export default router;