import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import parse from './parse';
import Szavazokor from '../../schemas/Szavazokor';
import generateVhuUrl from '../../functions/generateVhuUrl';
import SourceHtml from '../../schemas/SourceHtml';
import parseQuery from '../../functions/parseQuery';
import { crawl } from '../../crawler';

dotenv.config();

const router = express.Router()
let responses = {};

export const scraper_GET = async (SzavazokorId, query) => {
  let szavkorSorszam, telepulesKod, megyeKod, szavkor;

  try {
    if (SzavazokorId) {
      szavkor = await Szavazokor.findById(SzavazokorId)
      ;({
        szavkorSorszam,
        kozigEgyseg: {
          telepulesKod,
          megyeKod
        }
      } = szavkor)
    } else if (
      query.szavkorSorszam && 
      query['kozigEgyseg.telepulesKod'] &&
      query['kozigEgyseg.megyeKod']
    ) {
      szavkorSorszam = query.szavkorSorszam;
      telepulesKod = query['kozigEgyseg.telepulesKod'];
      megyeKod = query['kozigEgyseg.megyeKod'];
      query = parseQuery(query)
      szavkor = await Szavazokor.findOne(query)
    } else {
      crawl()
      return [200, { message:  'crawler started' }]
    }

    const { scrapeOnly, parseFromDb } = parseQuery(query)
    const url = generateVhuUrl(megyeKod, telepulesKod, szavkorSorszam)
    const polygonUrl = generateVhuUrl(megyeKod, telepulesKod, szavkorSorszam, true)

    let htmlUpdateResponse;
    let html;

    let sourceHtml = await SourceHtml.findOne({ megyeKod, telepulesKod, szavkorSorszam })

    if (parseFromDb) {
      htmlUpdateResponse = null;
      ({ html } = sourceHtml)
    } else {
      ({ data: html } = await axios.get(url));
      const { data: area } = await axios.get(polygonUrl);
      if (sourceHtml) {
        sourceHtml = Object.assign(sourceHtml, { url, html, area })
        htmlUpdateResponse = await sourceHtml.save(sourceHtml)
      } else {
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
    }

    responses = { ...responses, htmlUpdateResponse }

    let szavkorUpdateResponse;
    if (scrapeOnly) {
      szavkorUpdateResponse = null
    } else {
      const { kozteruletek, ...szkParsedData } = await parse(html)
      const newSzavkor = Object.assign(szavkor, szkParsedData)
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
    
    return [200, {
      message,
      responses
    }]
  } catch (error) {
    console.log(error)
    return [500, {
      error: error.message
    }]
  }  
}

router.get('/:SzavazokorId?', async (req, res) => {
  const {
    params: { SzavazokorId },
    query
  } = req;
  const [code, response] = await scraper_GET(SzavazokorId, query)
  res.status(code)
  res.json(response)
})

router.post('/', async (req, res) => {
  const { body } = req;
  res.json(body)
})

export default router;