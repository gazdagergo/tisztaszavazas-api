import express from 'express';
import KozigEgyseg from '../schemas/KozigEgyseg';
import getSortObject from '../functions/getSortObject';
import parseQuery from '../functions/parseQuery';
import authorization from '../middlewares/authorization';


/**
* @api {get} /kozigegysegek/ 1.) Összes közigazgatási egység
* @apiName kozigegysegek2
* @apiGroup Közigegységek
*
* @apiParam {Number} limit Csak a megadott számú találatot adja vissza (default 20)
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
  const isAdmin = roles.includes('admin');

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
    const projection = getProjection(req.user, 'byId')
    result = await KozigEgyseg.findById(id, projection)
    result = addGeneratedParams(result)
  } else {
    const projection = getProjection(req.user, 'byQuery')
    result = await KozigEgyseg.find(query, projection).sort(sort).limit(limit).skip(skip);
  }

  res.header('X-Total-Count', result.length)  
  res.json(result);
});

export default router;
