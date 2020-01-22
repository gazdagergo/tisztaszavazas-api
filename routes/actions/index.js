import express from 'express';
import * as actions from './definitions';

const router = express.Router()

router.post('/', async (req, res) => {
  const { 
    body,
  } = req;

  try {
    const { value1, value2, value3 } = body;
    const action = actions[value1];
    if (!action) {
      res.status(400);
      res.json(`action '${value1}' not found`)
      return false;
    }
    const [ state, data ] = await action(value2, value3);
    res.status(state);
    res.json(data);
  } catch(error){
    console.log(error);
    res.json({ error: error.message })
  }
})

export default router;