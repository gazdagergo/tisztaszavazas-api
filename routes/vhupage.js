const express = require('express')
const schemas = require('../schemas')

const router = express.Router()

router.get('/:db/:id', async (req, res) => {
  const [valasztasAzonosito, version] = req.params.db.split('_')

	try {
		const Szavazokors = schemas.Szavazokor[valasztasAzonosito][version] || schemas.Szavazokor[valasztasAzonosito].latest
		
		const { vhuUrl } = await Szavazokors.findById(req.params.id)
		res.redirect(vhuUrl)
	} catch(error){
		console.log(error.message || error)
		res.status(400)
		res.json('Not found')
	}
})

module.exports = router;
