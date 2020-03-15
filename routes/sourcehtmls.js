import express from 'express';
import SourceHtml from '../schemas/SourceHtml';
import parseQuery from '../functions/parseQuery';

const DEFAULT_LIMIT = 99999;

const router = express.Router()

router.get('/:SourceHtmlId?', async (req, res) => {
  let {
    params: { SourceHtmlId },
    query: { limit = DEFAULT_LIMIT, ...query }
  } = req;

  try {
    let result;
    if (SourceHtmlId) {
      result = await SourceHtml.findById(SourceHtmlId)
    } else {
      query = parseQuery(query)
      console.log(query)
      result = await SourceHtml.find(query, { html: 0, area: 0, url: 0 }).limit(+limit)
    }
    res.status(result ? 200 : 400)
    res.json(result || 'SourceHtml not found')
  } catch(error) {
    res.json({ error: error.message })
  }
})

export default router;