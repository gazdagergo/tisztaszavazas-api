import express from 'express';
import models from '../schemas';

const router = express.Router()

router.get('/:db/:id', async (req, res) => {
  const [valasztasAzonosito, version] = req.params.db.split('_')

	try {
		const Szavazokors = models.Szavazokor[valasztasAzonosito][version]
		const { vhuUrl } = await Szavazokors.findById(req.params.id)
		res.redirect(vhuUrl)
	} catch(error){
		console.log(error.message || error)
		res.status(400)
		res.json('Not found')
	}
})

export default router;
