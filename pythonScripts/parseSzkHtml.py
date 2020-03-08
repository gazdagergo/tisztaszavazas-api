
# coding=utf-8
#!/usr/bin/env python3

from bs4 import BeautifulSoup
import sys
import json
from getUtcaLista import getUtcaLista
from getSzavkorCim import getSzavkorCim

def main(html):
	print(html)

""" 	soup = BeautifulSoup(html, "html.parser")
	result = {
		"kozteruletek": getUtcaLista(soup),
		"szavkorCim": getSzavkorCim(soup)
	}
	print(json.dumps(result)) """

for linenum, line in enumerate(sys.stdin):
	if linenum == 0:
		print(line)

# for line in sys.stdin:
# print(sys.stdin)
	# main(line)

