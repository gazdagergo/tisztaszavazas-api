
# coding=utf-8
#!/usr/bin/env python3

from bs4 import BeautifulSoup
import sys
import json
import logging

from getUtcaLista import getUtcaLista
from getSzavkorDetails import getSzavkorDetails

def main(html):
	# logging.basicConfig(filename='example.log',level=logging.DEBUG)

	try:
		soup = BeautifulSoup(html, "html.parser")
		result = {
			**getUtcaLista(soup),
			**getSzavkorDetails(soup)
		}
		print(json.dumps(result))
	except:
		print(json.dumps({"error": "error"}))

if len(sys.argv)>1:
	# manual start
	html = open(sys.argv[1], 'r', encoding='utf-8')
	main(html)
else:
	for line in sys.stdin:
		main(json.loads(line)['html'])

