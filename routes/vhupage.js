import express from 'express';
import Szavazokor from '../schemas/Szavazokor';

const router = express.Router()

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
