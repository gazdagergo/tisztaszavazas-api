def getUtcaLista(soup):
	completeSettlement = soup.findAll("div", {"class": "nvi-complete-settlement-wrapper"})

	if completeSettlement:
		return []

	utcaList = soup.findAll("div", {"class": "nvi-search-list"})[0] \
	.findAll("div", {"class": "nvi-custom-table"})[0] \
	.findAll("table", {"class": "table"})[0] \
	.findAll("tr")

	def getUtcaNev(tRow):
		utcanev = tRow.findAll("div", {"class": "span6"})[0] \
		.getText() 

		return utcanev

	def getHazszamok(tRow):
		hazszamok = tRow.findAll("div", {"class": "span6"})[1] \
		.getText()

		return hazszamok
	
	utcaListPairs = []

	for item in utcaList:
		szkUtca = getUtcaNev(item).replace('Cím::  ', '')
		szkHazszamok = getHazszamok(item).replace('Tartomány típusa::  ', '')
		utcaListPairs.append({
			"szkUtca": szkUtca.strip(),
			"szkHazszamok": szkHazszamok.strip()
		})

	return utcaListPairs
	