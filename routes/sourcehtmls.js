import express from 'express';
import SourceHtml from '../schemas/SourceHtml';
import parseQuery from '../functions/parseQuery';
import authorization from '../middlewares/authorization';

const DEFAULT_LIMIT = 20;

const router = express.Router()

router.all('*', authorization)
router.all('*', (req, res, next) => {
  if (!req.user.roles || !req.user.roles.includes('admin')) {
    res.status(404)
    res.json('Not found')
    return
  }
  next()
})

router.get('/:SourceHtmlId?', async (req, res) => {
  let {
    params: { SourceHtmlId },
    query: { limit = DEFAULT_LIMIT, skip = 0, ...query }
  } = req;

  try {
    let result;
    if (SourceHtmlId) {
      result = await SourceHtml.findById(SourceHtmlId)
    } else {
      query = parseQuery(query)
      console.log(query)
      result = await SourceHtml
        .find(query, { html: 0, url: 0 })
        .skip(skip)
        .limit(+limit)
    }
    res.status(result ? 200 : 400)
    res.json(result || 'SourceHtml not found')
  } catch(error) {
    res.json({ error: error.message })
  }
})

export default router;