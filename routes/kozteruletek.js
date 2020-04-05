import express from 'express';
import Kozterulet from '../schemas/Kozterulet';
import parseQuery from '../functions/parseQuery';
import Szavazokor from '../schemas/Szavazokor';

const router = express.Router();

router.get('/', async (req, res) => {
  console.log(req.query.kozigEgysegNeve)
	const result = await Szavazokor.aggregate([
    { $match: { 'kozigEgyseg.kozigEgysegNeve': req.query.kozigEgysegNeve } },
    { $unwind: "$kozteruletek" },
    { $replaceRoot: { newRoot: "$kozteruletek" } },
    { $group: {
      _id: 'a',
      kozteruletek: {
      $addToSet: {
        kozteruletNev: '$kozteruletNev'
      }
    } } },
    { $unwind: "$kozteruletek" },
    { $sort: { 'kozteruletek.kozteruletNev':  1 } },
    { $group: {
      "_id": null,
      kozteruletek: { $push: '$kozteruletek' } }
    },

	]);
	res.json(result);
});

export default router;
