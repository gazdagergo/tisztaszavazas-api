def getSzavkorCim(soup):
	szavkorCim = soup.findAll("div", {"class": "szavazokorieredmenyek-details-container"})[0] \
	.findAll("div", {"class": "row-fluid"})[0] \
	.findAll("div", {"class": "row-fluid"})[0] \
	.findAll("span", {"class": "text-semibold"})[0] \
	.getText()

	return szavkorCim
	