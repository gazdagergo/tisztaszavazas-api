import express from 'express';
import KozigEgysegSchemas from '../schemas/KozigEgyseg';
import getSortObject from '../functions/getSortObject';
import parseQuery from '../functions/parseQuery';
import authorization from '../middlewares/authorization';


/**
* @api {get} /kozigegysegek/ 1.) Összes közigazgatási egység
* @apiName kozigegysegek2
* @apiGroup Közigegységek
*
* @apiParam {Number} limit Csak a megadott számú találatot adja vissza (default `20`)
* @apiHeader X-Valasztas-Kodja A választási adatbázis kiválasztása (default: `onk2019`)
* @apiHeader Authorization A regisztrációkor kapott kulcs
*
* @apiSuccessExample {json} Success-Response:
*  HTTP/1.1 200 OK
*  [
*    {
*      "_id": "5e88bd8701f9fd6efbda43c4",
*      "megyeNeve": "Budapest",
*      "kozigEgysegNeve": "Budapest X.ker",
*      "__v": 0
*    },
*    {
*      "_id": "5e88bd8701f9fd6efbda43c5",
*      "megyeNeve": "Budapest",
*      "kozigEgysegNeve": "Budapest XI.ker",
*      "__v": 0
*    },
* 		...
*   ]
* @apiSampleRequest off
*/

/**
 * @api {get} /kozigegysegek/:id? 2.) Egy közigazgatási egység összes adata
 * @apiName kozigegysegek3
 * @apiGroup Közigegységek
 *
 * @apiParam {String} id A közigazgatási egység azonosítója az adatbázisban
 * @apiHeader X-Valasztas-Kodja A választási adatbázis kiválasztása (default: `onk2019`)
 * @apiHeader Authorization A regisztrációkor kapott kulcs
 *  
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "_id": "5e88bd8701f9fd6efbda43c4",
 *    "megyeNeve": "Budapest",
 *    "kozigEgysegNeve": "Budapest X.ker",
 *    "szavazokorok": "/szavazokorok?kozigEgyseg.kozigEgysegNeve=Budapest%20X.ker",
 *    "kozteruletek": [
 *      {
 *        "kozteruletNev": "Agyagfejtő utca",
 *        "szavazokorok": "/szavazokorok?kozigEgyseg.kozigEgysegNeve=Budapest%20X.ker&kozteruletek.kozteruletNev=Agyagfejt%C5%91%20utca"
 *      },
 *      {
 *        "kozteruletNev": "Akna utca",
 *        "szavazokorok": "/szavazokorok?kozigEgyseg.kozigEgysegNeve=Budapest%20X.ker&kozteruletek.kozteruletNev=Akna%20utca"
 *      },
 *      ...
 *    ],          
 *    "__v": 0,
 *  }
 * 
 * @apiSampleRequest off
 */
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

const getProjection = ({ roles }, context) => {
  const isAdmin = roles && roles.includes('admin');

  let projection = {
    megyeKod: 0,
    telepulesKod: 0
  }

  switch (context) {
    case 'byId':
      return projection;
    case 'byQuery':
      projection = { ...projection, kozteruletek: 0 }
      return projection
    default:
      return projection
  }
}

router.all('*', authorization)

let KozigEgyseg;

router.all('*', (req, _res, next) => { 
  const db = req.headers['x-valasztas-kodja'] || 'onk2019'
  KozigEgyseg = KozigEgysegSchemas[`KozigEgyseg_${db}`]
  if (!KozigEgyseg){
    res.status(400)
    res.json({'error': `Hibás választás kód: '${db}'` })
    return
  }	  
  next()
})

router.get('/:id?', async (req, res) => {
  let {
    params: { id },
    query
  } = req;

  let limit, sort, skip, result, totalCount;
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
    const projection = getProjection(req.user, 'byId')
    result = await KozigEgyseg.findById(id, projection)
    result = addGeneratedParams(result)
    totalCount = 1;
  } else {
    const projection = getProjection(req.user, 'byQuery')
    const aggregation = [
      { $match: query },
      { $project: projection },
      { $skip: skip },
      { $limit: limit }
    ]

    ;([{ result, totalCount: [{ totalCount }] }] = await KozigEgyseg.aggregate([
      { $facet: {
        result: aggregation,
        totalCount: [{ $match: query },{ $count: 'totalCount' }]
      }
    }]))
  }

  res.header('X-Total-Count', totalCount)  
  res.json(result);
});

export default router;
