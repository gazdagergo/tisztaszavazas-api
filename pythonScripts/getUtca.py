
# coding=utf-8
#!/usr/bin/env python3

from bs4 import BeautifulSoup
import sys


def main(inputFile):
	""" Main entry point of the app """
	
	soup = BeautifulSoup(open(inputFile), "html.parser")

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
		print(szkUtca.strip())
		print(szkHazszamok.strip())

for line in sys.stdin:
	main(line.replace('\n', ''))

""" if __name__ == "__main__":
	main()	 """