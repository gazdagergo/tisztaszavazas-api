import express from 'express';
import SzavazokorSchemas from '../schemas/Szavazokor';

const router = express.Router()

let Szavazokor;

router.get('/:db/:id', async (req, res) => {
	try {
		Szavazokor = SzavazokorSchemas[`Szavazokor_${req.params.db}`]		
		const { vhuUrl } = await Szavazokor.findById(req.params.id)
		res.redirect(vhuUrl)
	} catch(error){h
		res.status(400)
		res.json('Not found')
	}
})

export default router;
