import express from 'express';
import SzavazokorSchemas from '../schemas/Szavazokor';

const router = express.Router()

let Szavazokor;

router.all('*', (req, _res, next) => { 
  const db = req.headers['x-valasztas-kodja'] || 'onk2019'
  Szavazokor = SzavazokorSchemas[`Szavazokor_${db}`]
  next()
})

router.get('/:id', async (req, res) => {
	try {
		const { vhuUrl } = await Szavazokor.findById(req.params.id)
		res.redirect(vhuUrl)
	} catch(error){
		res.status(400)
		res.json('Not found')
	}
})

export default router;
