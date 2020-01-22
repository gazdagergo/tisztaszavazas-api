import express from 'express';
import Device from '../schemas/Device'

const router = express.Router()

router.get('/:deviceName', async (req, res) => {
  const {
    params: { deviceName }
  } = req;
  
  try {
    const result = await Device.findOne({ name: deviceName })
    if (result) {
      res.json(result)
    } else {
      res.status(400);
      res.json(`Device not found with name '${deviceName}'`)
    }
  } catch(error){
    res.json({ error: error.message })
  }
})

router.post('/:deviceName', async (req, res) => {
  const { 
    body,
    params: { deviceName }
  } = req;

  console.log('POST', deviceName, ...body);

  try {
    const insertedRecords = await Device.insertMany([
      { name: deviceName, ...body },
    ])
    console.log(insertedRecords);
    res.json(insertedRecords)
  } catch(error){
    res.json({ error: error.message })
  }
})

router.put('/:deviceName', async (req, res) => {
  const { 
    body,
    params: { deviceName }
  } = req;

  console.log('PUT', deviceName, ...body)
  
  try {
    const updatedRecord = await Device.updateOne(
      { name: deviceName },
      { $set: body }
    )
    console.log(updatedRecord)
    res.json(updatedRecord)
  } catch(error){
    res.json({ error: error.message })
  }
})


export default router;