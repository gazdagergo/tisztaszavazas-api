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

const getSzavazokor = async (SzavazokorId, query) => {
  let szavazokor;
  try {
    if (SzavazokorId) {
      szavazokor = await Szavazokor.findById(SzavazokorId)
      szavazokor = [szavazokor]
    } else if (query) {
      query = parseQuery(query)
      szavazokor = await Szavazokor.find(query)    
    }

    if (!szavazokor){
      throw new Error('Szavazokor not found')
    }

    return szavazokor
  } catch(error) {
    throw error;
  }
}

export const scraper_GET = async (SzavazokorId, query) => {
  let szavkorSorszam, telepulesKod, megyeKod, szavazokor;

  try {
    const szavazokorok = await getSzavazokor(SzavazokorId, query)
    if (szavazokorok.length === 1) {
      szavazokor = szavazokorok[0]
      ;({
        szavkorSorszam,
        kozigEgyseg: {
          telepulesKod,
          megyeKod
        }
      } = szavazokor)
    } else {
      crawl(szavazokorok)
      return [200, {
        message: `crawler started on ${szavazokorok.length} szavazokors`,
        query
      }]
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
      const newSzavkor = Object.assign(szavazokor, szkParsedData)
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