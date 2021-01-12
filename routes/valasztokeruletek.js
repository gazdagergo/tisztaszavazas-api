import { Types } from 'mongoose'
import express from 'express';
import parseQuery from '../functions/parseQuery';
import authorization from '../middlewares/authorization';
import Models from '../schemas';
import getPrevNextLinks from '../functions/getPrevNextLinks';

/**
* @api {get} /valasztokeruletek/ 1.) Összes választókerület
* @apiName valasztokeruletek
* @apiGroup 3. Választókerületek
*
* @apiParam (Request Parameters) {Number} [limit] Csak a megadott számú találatot adja vissza (default: `20`)
* @apiParam (Request Parameters) {Number} [skip] A lapozáshoz használható paraméter. (default: `0`)
* @apiParam (Request Parameters) {Number|String|Regex|Query} [queryParameters] A rekordok bármely paramétere alapján lehet szűkíteni a listát.
* @apiHeader (Request Headers) Authorization A regisztrációkor kapott kulcs
* @apiHeader (Request Headers) [X-Valasztas-Kodja] A választási adatbázis kiválasztása (Lehetsésges értékek: 2018-as országgyűlési: `ogy2018`)
* @apiHeader (Response Headers) X-Total-Count A szűrési feltételeknek megfelelő, a válaszban lévő összes elem a lapozási beállításoktől függetlenül
* @apiHeader (Response Headers) X-Prev-Page A `limit` és `skip` paraméterekkel meghatározott lapozás következő oldala
* @apiHeader (Response Headers) X-Next-Page A `limit` és `skip` paraméterekkel meghatározott lapozás előző oldala
*
* @apiSuccessExample {json} Success-Response:
*  HTTP/1.1 200 OK
*  [
*    { 
*      "_id": "5eee424dac32540023500d13",
*      "leiras": "Budapest 1. számú OEVK",
*      "szam": 1,
*      "korzethatar": {
*        "type": "Polygon",
*        "coordinates": [
*           [
*             [
*               19.066171646118164,
*               47.47514343261719
*             ],
*             [
*               19.074604034423828,
*               47.477970123291016
*             ],
* 	  	      ...
*           ]
*         ]
*       }
*     }
*   ]
* @apiSampleRequest off
*/

/**
 * @api {get} /valasztokeruletek/:id 2.) Egy választókerület összes adata
 * @apiName valasztokeruletek2
 * @apiGroup 3. Választókerületek
 *
 * @apiParam {String} id A Választókerület azonosítója az adatbázisban
 * @apiHeader (Request Headers) Authorization A regisztrációkor kapott kulcs
 * @apiHeader (Request Headers) [X-Valasztas-Kodja] A választási adatbázis kiválasztása (lásd fent)
 *  
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  
 *  { 
 *    "_id": "5eee424dac32540023500d13",
 *    "leiras": "Budapest 1. számú OEVK",
 *    "szam": 1,
 *    "korzethatar": {
 *      "type": "Polygon",
 *      "coordinates": [
 *        [
 *           [
 *             19.066171646118164,
 *             47.47514343261719
 *           ],
 *           [
 *             19.074604034423828,
 *             47.477970123291016
 *           ],
 * 		      ...
 *         ]
 *       ]
 *     }
 *   }
 * 
 * @apiSampleRequest off
 */

const router = express.Router();

const DEFAULT_LIMIT = 20;

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

router.all('/:id?', async (req, res) => {
  try {
    let {
      params: { id },
      query,
      body,
    } = req;

    let limit, skip, result, totalCount
    query = parseQuery(query)

    ;({
      limit = DEFAULT_LIMIT,
      skip = 0,
      ...query
    } = query)

    if (id) {
      result = await Valasztokerulets.findById(id)
      totalCount = 1
    } else if (Object.keys(body).length){
      try {
        const aggregations = body
        result = await Valasztokerulets.aggregate(aggregations)
      } catch(error){
        result = error.message
      }
    } else {
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
