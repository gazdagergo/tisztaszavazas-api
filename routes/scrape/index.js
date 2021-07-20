import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import parse from './parse';
import Szavazokor from '../../schemas/Szavazokor';
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
    const polygonUrl = generateVhuUrl(megyeKod, telepulesKod, szavkorSorszam, true)

    let htmlUpdateResponse;
    let html;

    if (parseFromDb) {
      htmlUpdateResponse = null;
      ({ html } = await SourceHtml.findOne({ megyeKod, telepulesKod, szavkorSorszam }))
    } else {
      ({ data: html } = await axios.get(url));
      const { data: area } = await axios.get(polygonUrl);

      htmlUpdateResponse = await SourceHtml.insertMany([{
        megyeKod,
        telepulesKod,
        szavkorSorszam,
        url,
        html,
        area
      }])

      htmlUpdateResponse = htmlUpdateResponse[0]
    }

    responses = { ...responses, htmlUpdateResponse }

    const { kozteruletek, ...szkParsedData } = await parse(html)
      
    const newSzavkor = Object.assign(szavkor, szkParsedData)

    let szavkorUpdateResponse;
    if (scrapeOnly) {
      szavkorUpdateResponse = null
    } else {
      szavkorUpdateResponse = await newSzavkor.save()
    }

    responses = {...responses, szavkorUpdateResponse }

    let message;

    if (scrapeOnly && parseFromDb) {
      message = 'Nothing happened'
    } else if (scrapeOnly) {
      message = 'Szavazokor not updated. SourceHtml db updated'
    } else if (parseFromDb) {
      message = 'Szavazokor updated from stored SourceHtml db.'
    } else {
      message = 'Both szavazokor and sourceHtml updated from website.'
    }
    
    res.json({
      message,
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