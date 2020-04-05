import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import parse from './parse';
import Szavazokor from '../../schemas/Szavazokor';
import SourceHtml from '../../schemas/SourceHtml';
import parseQuery from '../../functions/parseQuery';
import { crawl } from '../../crawler';
import getCountryName from '../../functions/getCountryName';
import authorization from '../../middlewares/authorization';

dotenv.config();

const router = express.Router()
let responses = {};

export const scraper_GET = async (szavazokorId, query = {}) => {
  let szavazokorSzama,
    telepulesKod,
    megyeKod,
    szavazokor,
    vhuUrl,
    polygonUrl,
    scrapeOnly,
    parseFromDb,
    dontSaveHtml,
    timeoutSec
    ;

    query = parseQuery(query)
    ;({ scrapeOnly = false, parseFromDb = false, dontSaveHtml = false, timeoutSec, ...query } = query)

  try {
    if (szavazokorId) {
      szavazokor = await Szavazokor.findById(szavazokorId);
      ;({
        vhuUrl,
        polygonUrl,
        szavazokorSzama,
        kozigEgyseg: {
          megyeKod,
          telepulesKod
        }
      } = szavazokor)

    } else {
      const szavazokorok = await Szavazokor.find(query)
      crawl(szavazokorok, { scrapeOnly, parseFromDb, dontSaveHtml, timeoutSec }) 
      return [200, {
        message: `crawler started on ${szavazokorok.length} szavazokors`,
        query
      }]      
    }

    let htmlUpdateResponse,
    szavkorUpdateResponse,
    scrapeMsg,
    parseMsg,
    html,
    area;

    let { 0: sourceHtml } = await SourceHtml.find({ vhuUrl })
    let timeStamp = new Date()
    timeStamp = timeStamp.toISOString()

    if (parseFromDb && sourceHtml) {
      htmlUpdateResponse = null;
      scrapeMsg = 'Html update not requested. '
      ;({ html, area } = sourceHtml)
    } else if (parseFromDb && !sourceHtml) {
      throw new Error('Htm not available in db. ')
    } else {
      ;({ data: html } = await axios.get(vhuUrl));
      let area;
      try {
        ;({ data: area } = await axios.get(polygonUrl))
      } catch (error) {
        console.log('polygon error')
        area = null
      }

      if (dontSaveHtml) {
        scrapeMsg = 'Html persistence not requested. '
        htmlUpdateResponse = null
      } else if (sourceHtml) {
        sourceHtml = Object.assign(sourceHtml, { url: vhuUrl, html, area })
        htmlUpdateResponse = await sourceHtml.save(sourceHtml)
        scrapeMsg = 'Html updated in db. '
      } else {
        try {
          htmlUpdateResponse = await SourceHtml.insertMany([{
            szavazokorSzama,
            kozigEgyseg: {
              telepulesKod,
              megyeKod,
            },
            vhuUrl,
            html,
            area
          }])
          scrapeMsg = 'Html added to db. '
          // console.log({htmlUpdateResponse})     
          // htmlUpdateResponse = htmlUpdateResponse[0]
        } catch(error){
          // console.log(error)
          scrapeMsg = error.message
        }
      }
          
      const newSzavkor = Object.assign(szavazokor, {
        sourceHtmlUpdated: timeStamp,
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
        const newSzavkor = Object.assign(szavazokor, {
          ...szkParsedData,
          helyadatok: {
            korzethatar: area && area.polygon && JSON.parse(area.polygon.paths),
            szavazokorKoordinatai: area && area.map && area.map.center
          },
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
          // console.log(error)
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
    console.log(error.message)
    return [500, {
      error: error.message
    }]
  }  
}

router.all('*', authorization)
router.all('*', (req, res) => {
  if (!req.user.roles || !req.user.roles.includes('admin')) {
    res.status(404)
    res.json('Not found')
    return
  }
})

router.get('/:szavazokorId?', async (req, res) => {
  const {
    params: { szavazokorId },
    query,
  } = req;



  const [code, response] = await scraper_GET(szavazokorId, query)
  res.status(code)
  res.json(response)
})


export default router;