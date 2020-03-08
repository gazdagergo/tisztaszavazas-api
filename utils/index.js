export const toNumeric = string => isNaN(+string) ? string : +string

export const toRegex = string => {
	const parts = string.split('/')
	let regex = string;
  let options = '';
  
	if (parts.length > 1) {
		regex = parts[1];
		options = parts[2];
	} else {
    return string
  }
	try {
		return new RegExp(regex, options);
	} catch (e) {
		return string
	}
};
