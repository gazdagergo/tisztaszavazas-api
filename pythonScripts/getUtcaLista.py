# coding=utf-8
#!/usr/bin/env python3

import re
import logging


# https://regex101.com/r/vahPd7/6
regex = r"(?:\s*)?(?:([^\d]+)(?:(\d+)|(?:(\d+)-\d+))(?:\s?)(?:\s?/\s?)?([A-z])?(?:\s-\s)((?:[\d\s]+)|(?:\d+-(\d+)))(?:\s?)(?:\s?/\s?)?([A-z]?)\s?$)|^.+$"
def emptyOrStrip(string):
	return "" if not string else string.strip()

def isInt(value):
  try:
    int(value)
    return True
  except ValueError:
    return False

def nullOrInt(string):
	result = float(string.replace(' ', '')) if string and isInt(string.replace(' ', '')) else None
	return 9999 if (result and (result > 9999)) else result

def getUtcaLista(soup):
	logging.info('---getUtcaLista---')
	completeSettlement = soup.findAll("div", {"class": "nvi-complete-settlement-wrapper"})

	if completeSettlement:
		return {
			"kozteruletek": [],
			"egySzavazokorosTelepules": True
			}

	utcaList = soup.findAll("div", {"class": "nvi-search-list"})[0] \
	.findAll("div", {"class": "nvi-custom-table"})[0] \
	.findAll("table", {"class": "table"})[0] \
	.findAll("tr")

	logging.info('utcaList')
	logging.info(utcaList)

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

		matches = re.match(regex, szkUtca)

		kozteruletNev = emptyOrStrip(matches.group(1)) if emptyOrStrip(matches.group(1)) else emptyOrStrip(matches.group(0))
		vegsoHazszam = nullOrInt(matches.group(6)) if nullOrInt(matches.group(6)) else nullOrInt(matches.group(5))

		utcaListItem = {
			"leiras": matches.group().strip(),
			"kozteruletNev": kozteruletNev,
			"kezdoHazszam": nullOrInt(matches.group(3) or matches.group(2)),
			"vegsoHazszam": vegsoHazszam,
			"megjegyzes": szkHazszamok.strip()
		}
		logging.info(utcaListItem)
		utcaListPairs.append(utcaListItem)

	logging.info(utcaListPairs)
		
	return {
		"kozteruletek": utcaListPairs,
		"egySzavazokorosTelepules": False
		}
	