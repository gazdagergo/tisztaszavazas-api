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


export const scraper_GET = async (szavazokorId, query = {}) => {
  let szavkorSorszam,
    telepulesKod,
    megyeKod,
    szavazokor,
    vhuUrl,
    polygonUrl,
    sourceHtmlEntryId,
    scrapeOnly,
    parseFromDb;

    query = parseQuery(query)
    ;({ scrapeOnly, parseFromDb, ...query } = query)

  try {
    if (szavazokorId) {
      szavazokor = await Szavazokor.findById(szavazokorId)
      ;({ vhuUrl, polygonUrl, sourceHtmlEntryId } = szavazokor)
    } else if (Object.keys(query).length) {
      const szavazokorok = await Szavazokor.find(query)
      crawl(szavazokorok) 
      return [200, {
        message: `crawler started on ${szavazokorok.length} szavazokors`,
        query
      }]      
    }


    let htmlUpdateResponse;
    let szavkorUpdateResponse;
    let html;

    let sourceHtml = await SourceHtml.findById(sourceHtmlEntryId)
    let timeStamp = new Date()
    timeStamp = timeStamp.toISOString()

    if (parseFromDb) {
      htmlUpdateResponse = null;
      ({ html } = sourceHtml)
    } else {
      ;({ data: html } = await axios.get(vhuUrl));
      const { data: area } = await axios.get(polygonUrl);

      if (sourceHtml) {
        sourceHtml = Object.assign(sourceHtml, { url: vhuUrl, html, area })
        htmlUpdateResponse = await sourceHtml.save(sourceHtml)
      } else {
        htmlUpdateResponse = await SourceHtml.insertMany([{
          szavkorSorszam,
          kozigEgyseg: {
            telepulesKod,
            megyeKod,
          },
          vhuUrl,
          html,
          area
        }])

        htmlUpdateResponse = htmlUpdateResponse[0]
      }
      const { _id: sourceHtmlEntryId } = htmlUpdateResponse;
      const newSzavkor = Object.assign(szavazokor, {
        sourceHtmlUpdated: timeStamp,
        sourceHtmlEntryId
      })
      szavkorUpdateResponse = await newSzavkor.save()
    }

    responses = { ...responses, htmlUpdateResponse }

    if (scrapeOnly) {
      szavkorUpdateResponse = null
    } else {
      const { kozteruletek, ...szkParsedData } = await parse(html)
      const newSzavkor = Object.assign(szavazokor, {
        ...szkParsedData,
        kozteruletek,
        parsedFromSrcHtml: timeStamp
      })
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
      szavazokorId,
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

router.get('/:szavazokorId?', async (req, res) => {
  const {
    params: { szavazokorId },
    query
  } = req;
  const [code, response] = await scraper_GET(szavazokorId, query)
  res.status(code)
  res.json(response)
})

router.post('/', async (req, res) => {
  const { body } = req;
  res.json(body)
})

export default router;