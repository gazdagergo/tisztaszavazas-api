import express from 'express';
import Kozterulet from '../schemas/Kozterulet';
import parseQuery from '../functions/parseQuery';
import Szavazokor from '../schemas/Szavazokor';

const router = express.Router()

router.get('/', async (req, res) => {
  const result = await Szavazokor.aggregate([
    { $match: { 'kozigEgyseg.kozigEgysegNeve': 'Balatonfenyves' } },
    { $unwind: '$kozteruletek' },
    { $project: { _id: 0, kozteruletek: 1 } }
  ])
  res.json(result)
})


export default router;