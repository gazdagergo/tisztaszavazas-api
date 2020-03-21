import re


def getSzavkorDetails(soup):

	groupDiv = soup.findAll("div", {"class": "szavazokorieredmenyek-details-container"})[0]

	szavazokorCime = groupDiv \
	.findAll("div", {"class": "row-fluid"})[0] \
	.findAll("div", {"class": "row-fluid"})[0] \
	.findAll("span", {"class": "text-semibold"})[0] \
	.getText()

	telepulesNev = groupDiv \
	.findAll("div", {"class": "span6"})[1] \
	.findAll("div", {"class": "span6"})[1] \
	.getText()
		
	regex = r"^(.[^\d]+)\d{1,3}. szavazókör"
	matches = re.match(regex, telepulesNev)

	valasztokeruletLeiras = groupDiv \
	.findAll("div", {"class": "span6"})[4] \
	.findAll("span", {"class": "text-semibold"})[0] \
	.getText()

	regex = r"^.[^\d]+(\d{1,3})."
	matches = re.match(regex, valasztokeruletLeiras)

	return {
		"szavazokorCime": szavazokorCime.strip(),
		"kozigEgyseg": {
			"kozigEgysegNeve": matches.group(1).strip()
		},
		"valasztokerulet": {
			"leiras": valasztokeruletLeiras.strip(),
			"szam": matches.group(1)
		}
	}
	