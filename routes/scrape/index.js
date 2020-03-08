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
    Szavazokor.findById(SzavazokorId)
    .then(async szavkor => {
      const { szavkorSorszam,
        kozigEgyseg: {
          telepulesKod,
          megyeKod
        }
      } = szavkor;
      const url = generateVhuUrl(megyeKod, telepulesKod, szavkorSorszam)
      console.log(url)
      const html = await getHtml(url)
      const szkParsedData = await parse(html)
      const newSzavkor = Object.assign(szavkor, szkParsedData)
      return newSzavkor
    })
    .then(szavkor => {
      return szavkor.save()
    })
    .then(updatedSzavkor => res.json({
      'message': 'szavazokor frissitve',
      updatedSzavkor
    }))
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