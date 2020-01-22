import express from 'express';
import dotenv from 'dotenv'
dotenv.config()

const generateUniqueId = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

const IFTTT_KEY = process.env.IFTTT_KEY;

const router = express.Router()

router.get('/v1/status', (req, res) => {
	const key = req.get("IFTTT-Service-Key");
    
	if (key !== IFTTT_KEY) {
		res.status(401).send();
	}	
  res.status(200).send();
});

router.post('/v1/test/setup', (req, res) => {
	const key = req.get("IFTTT-Service-Key");
    
	if (key !== IFTTT_KEY) {
		res.status(401).send();
	}	

  res.status(200).send({
    "data": {
      samples: {
        actionRecordSkipping: {
          create_new_thing: { invalid: "true" }
        }
      }
    }
  });
});

router.post('/v1/triggers/new_thing_created', (req, res) => {
  
  const key = req.get("IFTTT-Service-Key");
  
  if (key !== IFTTT_KEY) {
    res.status(401).send({
      "errors": [{
        "message": "Channel/Service key is not correct"
      }]
    });
  }
  
	let data = [];
  let numOfItems = req.body.limit;
  
  if (typeof numOfItems === "undefined") { // Setting the default if limit doesn't exist.
    numOfItems = 3;
  }
  
  if (numOfItems >= 1) {
    for (let i = 0; i < numOfItems; i += 1) {
      data.push({
        "created_at": (new Date()).toISOString(), // Must be a valid ISOString
        "meta": {
          "id": generateUniqueId(),
          "timestamp": Math.floor(Date.now() / 1000) // This returns a unix timestamp in seconds.
        }
      });
    }
  }
  
  res.status(200);
  res.json({
    "data": data
  });

});


	router.post('/v1/actions/create_new_thing', (req, res) => {
  
  const key = req.get("IFTTT-Service-Key");
  
  if (key !== IFTTT_KEY) {
    res.status(401).send({
      "errors": [{
        "message": "Channel/Service key is not correct"
      }]
    });
  }
  
  res.status(200)
  res.json({
    "data": [{
      "id": generateUniqueId()
    }]
  });
  
});

export default router;
