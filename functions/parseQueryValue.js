export const toNumeric = string => {
  if (isNaN(+string)) {
    return null
  } else {
    return +string
  } 
}

export const toRegex = string => {
	const parts = string.split('/')
	let regex = string;
  let options = '';
  
	if (parts.length > 1) {
		regex = parts[1];
		options = parts[2];
	} else {
    return null
  }
	try {
		return new RegExp(regex, options);
	} catch (e) {
		return null
	}
};

export const toBoolean = string => {
  if (string === 'false') return false;
  if (string === 'true') return true;
  return null;
}

export default value => {
  let parsed = toBoolean(value); if (parsed !== null) return parsed;
  parsed = toNumeric(value); if (parsed !== null) return parsed;
  parsed = toRegex(value); if (parsed !== null) return parsed;
  return value
}