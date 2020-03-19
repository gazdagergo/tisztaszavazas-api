
# coding=utf-8
#!/usr/bin/env python3

from bs4 import BeautifulSoup
import sys
import json

from getSzkList import getSzkList


def main(html):
	soup = BeautifulSoup(html, "html.parser")
	try:
		result = getSzkList(soup)
		print(json.dumps(result))
	except:
		print(json.dumps({ "error": "NoResult" }))

if len(sys.argv)>1:
	# manual start
	html = open(sys.argv[1], 'r', encoding='utf-8')
	main(html)
else:
	for line in sys.stdin:
		main(json.loads(line)['html'])

