import re

regex = r"^(.[^\d]+)\d{1,3}. szavazókör"

def getSzavkorDetails(soup):
	szavkorCim = soup.findAll("div", {"class": "szavazokorieredmenyek-details-container"})[0] \
	.findAll("div", {"class": "row-fluid"})[0] \
	.findAll("div", {"class": "row-fluid"})[0] \
	.findAll("span", {"class": "text-semibold"})[0] \
	.getText()

	telepulesNev = soup.findAll("div", {"class": "szavazokorieredmenyek-details-container"})[0] \
	.findAll("div", {"class": "span6"})[1] \
	.findAll("div", {"class": "span6"})[1] \
	.getText()
		
	matches = re.match(regex, telepulesNev)

	return {
		"szavkorCim": szavkorCim,
		"kozigEgyseg": {
			"kozigEgysegNeve": matches.group(1).strip()
		}
	}
	