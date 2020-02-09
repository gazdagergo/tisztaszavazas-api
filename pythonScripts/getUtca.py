
# coding=utf-8
#!/usr/bin/env python3

from bs4 import BeautifulSoup
import sys
import json


def main(html):
	""" Main entry point of the app """
	
	soup = BeautifulSoup(html, "html.parser")

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

	for item in utcaList:
		szkUtca = getUtcaNev(item).replace('Cím::  ', '')
		szkHazszamok = getHazszamok(item).replace('Tartomány típusa::  ', '')
		result = {
			"szkUtca": szkUtca.strip(),
			"szkHazszamok": szkHazszamok.strip()
		}
	
		print(json.dumps(result))

for line in sys.stdin:
	main(json.loads(line)['html'])

""" if __name__ == "__main__":
	main()	 """