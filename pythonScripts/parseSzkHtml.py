
# coding=utf-8
#!/usr/bin/env python3

from bs4 import BeautifulSoup
import sys
import json

def getUtca(soup):
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
	

def getSzavkorCim(soup):
	szavkorCim = soup.findAll("div", {"class": "szavazokorieredmenyek-details-container"})[0] \
	.findAll("div", {"class": "row-fluid"})[0] \
	.findAll("div", {"class": "row-fluid"})[0] \
	.findAll("span", {"class": "text-semibold"})[0] \
	.getText()

	return szavkorCim
	

def main(html):
	soup = BeautifulSoup(html, "html.parser")
	result = {
		"kozteruletek": getUtca(soup),
		"szavkorCim": getSzavkorCim(soup)
	}
	print(json.dumps(result))


for line in sys.stdin:
	main(json.loads(line)['html'])

