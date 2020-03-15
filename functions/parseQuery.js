const toNumeric = string => {
  if (isNaN(+string)) {
    return null
  } else {
    return +string
  } 
}

const toRegex = string => {
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

const toBoolean = string => {
  if (string === 'false') return false;
  if (string === 'true') return true;
  return null;
}

const toQueryObject = string => {
	const regex = /\{\s*(\$.[^:]*):\s*(.*[^\s])\s*\}/;
	const group = string.match(regex)
	if (group){
		return {[group[1]]: parseQueryValue(group[2])}
	}
	return null
}

const parseQueryValue = value => {
  let parsed = toBoolean(value); if (parsed !== null) return parsed;
  parsed = toNumeric(value); if (parsed !== null) return parsed;
  parsed = toRegex(value); if (parsed !== null) return parsed;
  parsed = toQueryObject(value); if (parsed !== null) return parsed;
  return value
}

const parseQuery = query => (
	Object.entries(query).reduce((acc, [key, value]) => ({
		...acc, [key]: parseQueryValue(value)
	}), {})
)

export default parseQuery
