export const validateRegex = (pattern) => {
	const parts = pattern.split('/')
	let regex = pattern;
  let options = '';
  
	if (parts.length > 1) {
		regex = parts[1];
		options = parts[2];
	} else {
    return pattern
  }
	try {
		return new RegExp(regex, options);
	} catch (e) {
		return false;
	}
};
