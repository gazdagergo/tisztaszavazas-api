import requestify from 'requestify';


export const getRequest = async (url, authtoken, apiKey = '', query) => {
	try {
    let response = await requestify.get(
      `${url}${query || ''}`,
      {
        headers: {
          authtoken,
          api_key: apiKey
        },
      }
    )

    return response;
    
  } catch(error) {
    return error
  }	
}

export const postRequest = async (url, body, authtoken, apiKey = '', query) => {
  try {
    const response = await requestify.post(
    `${url}${query || ''}`,
      body,
      { headers: {
        authtoken,
        api_key: apiKey
      } }
    )
    if (response) {
      return response.getBody()
    }    
  } catch(error) {
    return { error }
  }
}


export const putRequest = async (url, body, authtoken, apiKey = '', query) => {
  try {
    const response = await requestify.put(
      `${url}${query || ''}`,
      body,
      { headers: {
        authtoken,
        api_key: apiKey
      } }
    )
    if (response) {
      return response.getBody()
    }    
  } catch(error) {
    return { error }
  }
}