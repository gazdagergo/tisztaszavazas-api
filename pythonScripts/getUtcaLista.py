# coding=utf-8
#!/usr/bin/env python3

import re

regex = r"(?:(^[^\d]+)(\d+|(?:(\d+)-\d+))(?:\s?)([A-z])?(?:\s-\s)((?:[\d\s]+)|(?:\d+-(\d+)))(?:\s?)([A-z]?)$)|^.+$"

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

		utcaListPairs.append({
			"leiras": matches.group().strip(),
			"kozteruletNev": kozteruletNev,
			"kezdoHazszam": nullOrInt(matches.group(2)),
			"vegsoHazszam": vegsoHazszam,
			"megjegyzes": szkHazszamok.strip()
		})
		
# https://regex101.com/r/vahPd7/1

	return {
		"kozteruletek": utcaListPairs,
		"egySzavazokorosTelepules": False
		}
	