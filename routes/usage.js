import express from 'express';
import Schema from '../schemas/Usage'
import authorization from '../middlewares/authorization';

const router = express.Router()

router.all('*', authorization)

router.get('/', async (req, res) => {
	const { name } = req.user;
	const result = await Schema.aggregate([{ $match: { name } }])

	res.json(result)
})


export default router;