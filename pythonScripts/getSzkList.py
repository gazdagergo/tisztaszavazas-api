# coding=utf-8
#!/usr/bin/env python3

def getSzkList(soup):
	szkList = soup.findAll("div", {"class": "nvi-search-list"})[0] \
	.findAll("div", {"class": "nvi-custom-table"})[0] \
	.findAll("table", {"class": "table"})[0] \
	.findAll("tr")

	# return szkList

	# return {
	# 	"foo": "bar"
	# }

	def getSzavkorUrl(tRow):
		szavkorHref = tRow.findAll("a", href=True)
		for a in szavkorHref:
			return a['href']
	
	szkParams = []

	for item in szkList:
		szkUrl = getSzavkorUrl(item)

		szkParams.append({
			"szkUrl": szkUrl
		})

	return {
		"szkParams": szkParams,
	}
	