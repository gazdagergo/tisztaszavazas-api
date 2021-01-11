import { Types } from 'mongoose'
import express from 'express';
import parseQuery from '../functions/parseQuery';
import authorization from '../middlewares/authorization';
import Models from '../schemas';
import getPrevNextLinks from '../functions/getPrevNextLinks';

/**
* @api {get} /valasztokeruletek/ 1.) Összes választókerület
* @apiName valasztokeruletek
* @apiGroup Választókerületek
*
* @apiParam (Request Parameters) {Number} [limit] Csak a megadott számú találatot adja vissza (default: `20`)
* @apiParam (Request Parameters) {Number} [skip] A lapozáshoz használható paraméter. (default: `0`)
* @apiHeader (Request Headers) Authorization A regisztrációkor kapott kulcs
* @apiHeader (Request Headers) [X-Valasztas-Kodja] A választási adatbázis kiválasztása (default: `onk2019`)
* @apiHeader (Response Headers) X-Total-Count A szűrési feltételeknek megfelelő, a válaszban lévő összes elem a lapozási beállításoktől függetlenül
* @apiHeader (Response Headers) X-Prev-Page A `limit` és `skip` paraméterekkel meghatározott lapozás következő oldala
* @apiHeader (Response Headers) X-Next-Page A `limit` és `skip` paraméterekkel meghatározott lapozás előző oldala
*
* @apiSuccessExample {json} Success-Response:
*  HTTP/1.1 200 OK
*  [
*    {
*      "_id": "006f6e6b3230313903f2",
*      "megyeNeve": "Budapest",
*      "kozigEgysegNeve": "Budapest X.ker",
*      "kozigEgysegSzavazokoreinekSzama": 76
*    },
*    {
*      "_id": "006f6e6b3230313903f3",
*      "megyeNeve": "Budapest",
*      "kozigEgysegNeve": "Budapest XI.ker",
*      "kozigEgysegSzavazokoreinekSzama": 115
*    },
* 		...
*   ]
* @apiSampleRequest off
*/

/**
 * @api {get} /valasztokeruletek/:id? 2.) Egy választókerület összes adata
 * @apiName valasztokeruletek2
 * @apiGroup Választókerületek
 *
 * @apiParam {String} id A közigazgatási egység azonosítója az adatbázisban
 * @apiHeader (Request Headers) Authorization A regisztrációkor kapott kulcs
 * @apiHeader (Request Headers) [X-Valasztas-Kodja] A választási adatbázis kiválasztása (default: `onk2019`)
 *  
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  
 * {
 *   "_id": "006f6e6b3230313903f2",
 *   "megyeNeve": "Budapest",
 *   "kozigEgysegNeve": "Budapest X.ker",
 *   "kozigEgysegSzavazokoreinekSzama": 76,
 *   "szavazokorok": [
 *     {
 *       "szavazokorSzama": 1,
 *       "link": "/szavazokorok/5e77c3f08723e7a7b25c47c6"
 *     },
 *     {
 *       "szavazokorSzama": 2,
 *       "link": "/szavazokorok/5e77c3f08723e7a7b25c47c7"
 *     },
 *   ...
 *     {
 *       "szavazokorSzama": 76,
 *       "link": "/szavazokorok/5e77c3f08723e7a7b25c47c9"
 *     }
 *   ],
 *   "kozteruletek": [
 *     {
 *       "kozteruletNev": "Agyagfejtő utca",
 *       "kozteruletSzavazokorei": "/szavazokorok?kozigEgyseg.kozigEgysegNeve=Budapest%20X.ker&kozteruletek.kozteruletNev=Agyagfejt%C5%91%20utca"
 *     },
 *     {
 *       "kozteruletNev": "Akna utca",
 *       "kozteruletSzavazokorei": "/szavazokorok?kozigEgyseg.kozigEgysegNeve=Budapest%20X.ker&kozteruletek.kozteruletNev=Akna%20utca"
 *     },
 *  ...
 * }
 * 
 * @apiSampleRequest off
 */

const router = express.Router();

const DEFAULT_LIMIT = 20;

const getProjection = ({ roles }, context) => {
  const isAdmin = roles && roles.includes('admin');

  let projection = {
    telepulesKod: 0,
    megyeKod: 0,    
  }

  switch (context) {
    case 'byId':
    case 'byQuery':
    default:
      return projection
  }
}


router.all('*', authorization)

let Valasztokerulets, db;

router.all('*', (req, res, next) => { 
  db = req.headers['x-valasztas-kodja'] || process.env.DEFAULT_DB
  const [valasztasAzonosito, version] = db.split('_')
  Valasztokerulets = Models.Valasztokerulet[valasztasAzonosito][version] || Models.Valasztokerulet[valasztasAzonosito].latest
  if (!Valasztokerulets){
    res.status(400)
    res.json({'error': `Hibás választás kód: '${db}'` })
    return
  }
  next()
})

router.get('/:id?', async (req, res) => {
  try {
    let {
      params: { id },
      query
    } = req;

    let limit, skip, result, totalCount
    query = parseQuery(query)

    console.log({query})

    ;({
      limit = DEFAULT_LIMIT,
      skip = 0,
      ...query
    } = query)

    if (id) {
      result = await Valasztokerulets.findById(id)
      totalCount = 1
    } else {

      console.log('vk', { query })

      let aggregations = [
        { $match: query },
        { $skip: skip },
        { $limit: limit },
      ]

      ;([{ result, totalCount }] = await Valasztokerulets.aggregate([{
        $facet: {
          result: aggregations,
          totalCount: [{ $match: query },{ $count: 'totalCount' }] }
      }]))

      totalCount = totalCount && totalCount[0] && totalCount[0].totalCount   
    }

    const prevNextLinks = getPrevNextLinks({
      route: 'valasztokeruletek',
      skip,
      limit,
      query,
      totalCount
    })

    res.header({...prevNextLinks})
    res.header('X-Total-Count', totalCount)  
    res.json(result);
  } catch (error) {
    console.log(error)
    res.status(404);
    res.json('Valasztokerulet not found')
  }
});

export default router;
