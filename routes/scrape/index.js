import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import parse from './parse';
import Szavazokor from '../../schemas/Szavazokor';
import generateVhuUrl from '../../functions/generateVhuUrl';
import SourceHtml from '../../schemas/SourceHtml';
import parseQuery from '../../functions/parseQuery';
import { crawl } from '../../crawler';
import getCountryName from '../../functions/getCountryName';

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


    let htmlUpdateResponse,
    szavkorUpdateResponse,
    scrapeMsg,
    parseMsg,
    html;

    let sourceHtml = await SourceHtml.findById(sourceHtmlEntryId)
    let timeStamp = new Date()
    timeStamp = timeStamp.toISOString()

    if (parseFromDb) {
      htmlUpdateResponse = null;
      scrapeMsg = 'Html update not requested. '
      ;({ html } = sourceHtml)
    } else {
      ;({ data: html } = await axios.get(vhuUrl));
      const { data: area } = await axios.get(polygonUrl);

      if (sourceHtml) {
        sourceHtml = Object.assign(sourceHtml, { url: vhuUrl, html, area })
        htmlUpdateResponse = await sourceHtml.save(sourceHtml)
        scrapeMsg = 'Html updated in db. '
      } else {
        try {
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
          scrapeMsg = 'Html added to db. '
          htmlUpdateResponse = htmlUpdateResponse[0]
        } catch(error){
          scrapeMsg = 'DB error while updating html.'
        }
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
      parseMsg = 'Szavkor update not requested. '
    } else {
      const { error, ...szkParsedData } = await parse(html)
      if (error && error === 'error') {
        parseMsg = 'Parsing error, szavkor not updated. '
      } else {
        console.log(szkParsedData.kozigEgyseg)
        const newSzavkor = Object.assign(szavazokor, {
          ...szkParsedData,
          kozigEgyseg: {
            ...szavazokor.kozigEgyseg,
            megyeNeve: getCountryName(szavazokor.kozigEgyseg.megyeKod),
            ...szkParsedData.kozigEgyseg,
          },
          parsedFromSrcHtml: timeStamp
        })
        try {
          szavkorUpdateResponse = await newSzavkor.save()
          parseMsg = 'Szavkor parsed and updated successfully.'
        } catch(error) {
          console.log(error)
          parseMsg = 'Szavkor write db error. Szavkor not updated.'
        }
      }
    }

    responses = {...responses, szavkorUpdateResponse }

    let message;

    if (!scrapeMsg && !parseMsg) {
      message = 'Nothing happened'
    } else {
      message = scrapeMsg + parseMsg
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