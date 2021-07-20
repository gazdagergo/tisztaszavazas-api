import express from 'express';
import KozigEgyseg from '../schemas/KozigEgyseg';
import getSortObject from '../functions/getSortObject';
import parseQuery from '../functions/parseQuery';

const router = express.Router();

const DEFAULT_LIMIT = 20;
const DEFAULT_SORT = 'megyeKod,telepulesKod'

const addGeneratedParams = entry => {
  const szavazokorok = `/szavazokorok?kozigEgyseg.kozigEgysegNeve=${encodeURIComponent(entry.kozigEgysegNeve)}`
  let kozteruletek = null;
  if (entry.kozteruletek && entry.kozteruletek.map) {
    kozteruletek = entry.kozteruletek.map(kozterulet => ({
      ...kozterulet,
      szavazokorok: `/szavazokorok?kozigEgyseg.kozigEgysegNeve=${encodeURIComponent(entry.kozigEgysegNeve)}&kozteruletek.kozteruletNev=${encodeURIComponent(kozterulet.kozteruletNev)}`
    }))
  }

  return ({
    ...entry['_doc'],
    szavazokorok,
    kozteruletek
  })
}


router.get('/:id?', async (req, res) => {
  let {
    params: { id },
    query
  } = req;

  let limit, sort, skip, result;
  query = parseQuery(query)
  ;(
    {
      limit = DEFAULT_LIMIT,
      skip = 0,
      sort = DEFAULT_SORT,
      ...query
    } = query
  )

  sort = getSortObject(sort)

  if (id) {
    result = await KozigEgyseg.findById(id)
    result = addGeneratedParams(result)
  } else {
    result = await KozigEgyseg.find(query).sort(sort).limit(limit).skip(skip);
    if (result.length === 1) {
      result = [addGeneratedParams(result[0])]
    }
  }

	await KozigEgyseg.find()
  res.json(result);
});

export default router;
