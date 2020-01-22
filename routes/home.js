import express from 'express';
import showdown from 'showdown';
import { readFile } from 'fs'


const converter = new showdown.Converter();
const router = express.Router()

const getReadme = () => new Promise(( resolve ) => 
  readFile('./README.md', 'utf8', (err, data) => {
    resolve(data)
  })
)

router.get('/', async (req, res) => {
  const md = await getReadme()
  if (md) {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.write(converter.makeHtml(md));
    res.end();
  }
})

export default router;
