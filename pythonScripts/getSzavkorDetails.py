import re

def getSzavkorDetails(soup):

	groupDiv = soup.findAll("div", {"class": "szavazokorieredmenyek-details-container"})[0]

	# szavazokorCime
	szavazokorCime = groupDiv \
	.findAll("div", {"class": "row-fluid"})[0] \
	.findAll("div", {"class": "row-fluid"})[0] \
	.findAll("span", {"class": "text-semibold"})[0] \
	.getText()

	# telepulesNev
	telepulesNev = groupDiv \
	.findAll("div", {"class": "span6"})[1] \
	.findAll("div", {"class": "span6"})[1] \
	.getText()
		
	regex = r"^(.[^\d]+)\d{1,3}. szavazókör"
	telepulesNevMatches = re.match(regex, telepulesNev)

	# valasztokeruletLeiras
	valasztokeruletLeiras = groupDiv \
	.findAll("div", {"class": "span6"})[4] \
	.findAll("span", {"class": "text-semibold"})[0] \
	.getText()

	regex = r"^.[^\d]+(\d{1,3})."
	valasztokeruletLeirasMatches = re.match(regex, valasztokeruletLeiras)

	# valasztokSzama
	valasztokSzama = groupDiv \
	.findAll("div", {"class": "span6"})[5] \
	.findAll("span", {"class": "text-semibold"})[0] \
	.getText()

	regex = r"^\s?(.+) f.+"
	valasztokSzamaMatches = re.match(regex, valasztokSzama)

	# akadalymentes
	akadalymentes = groupDiv \
	.select("div[class*=akadalymentes]")


	return {
		"szavazokorCime": szavazokorCime.strip(),
		"kozigEgyseg": {
			"kozigEgysegNeve": telepulesNevMatches.group(1).strip()
		},
		"valasztokerulet": {
			"leiras": valasztokeruletLeiras.strip(),
			"szam": int(valasztokeruletLeirasMatches.group(1))
		},
		"valasztokSzama": int(valasztokSzamaMatches.group(1)),
		"akadalymentes": bool(len(akadalymentes)),
		# "frissitveValasztasHun": 
	}
	