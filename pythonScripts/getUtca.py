
# coding=utf-8
#!/usr/bin/env python3

from bs4 import BeautifulSoup
import sys


def main():
		""" Main entry point of the app """

		inputFile = sys.argv[1]
		outputFile = sys.argv[2]
		# parser = etree.HTMLParser()
		# tree = etree.parse(inputFile, parser)
		
		soup = BeautifulSoup(open(inputFile), "html.parser")

		#utcaList = tree.xpath("//*[contains(@class, 'list-item row-fluid')]")
		# '//*[@id="_onkszavazokorieredmenyek_WAR_nvinvrportlet_fm"]/div/div[3]/div/table/tr[1]/td/div/div[1]/span/text()'

		utcaList = soup.findAll("div", {"class": "nvi-search-list"})[0] \
		.findAll("div", {"class": "nvi-custom-table"})[0] \
		.findAll("table", {"class": "table"})[0] \
		.findAll("tr")

		def getUtcaNev(tRow):
			utcanev = tRow.findAll("div", {"class": "span6"})[0] \
			.getText() #\
			#.encode('utf-8').strip()

			return utcanev

		def getHazszamok(tRow):
			hazszamok = tRow.findAll("div", {"class": "span6"})[1] \
			.getText() #\
			#.encode('utf-8').strip()

			return hazszamok

		for item in utcaList:
			szkUtca = getUtcaNev(item).replace('Cím::  ', '')
			szkHazszamok = getHazszamok(item).replace('Tartomány típusa::  ', '')

			with open(outputFile,'a') as fd:
				fd.write("\n")
				fd.write(szkUtca)
				fd.write("\t")
				fd.write(szkHazszamok)
				fd.write("\t")
				fd.write(inputFile.replace('.html', '').split('/')[-1])

if __name__ == "__main__":
    """ This is executed when run from the command line """
    main()