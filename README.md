# Szavazokorok

## Authorization

Add your token to the header of the request:

```json
{ "header": {
	"Authorization": "{{authtoken}}"
}}
```

## Endpoints

### /szavazokorok

#### Get all ballot office

`GET /szavazokorok`

#### Get a single ballot office

`GET /szavazokorok/5e405d6a0ff37a310a0840dd`

#### Query ballot offices

*Find by match with multiple properties*

`GET /szavazokorok?kozigEgyseg.megyeKod=1&kozigEgyseg.telepulesKod=1&szavazokorSzama=12`


#### Query ballot offices based on voter address

1: First check the name of settlement. If result length is 1, the whole settlement belongs to one ballot office.

`GET /kozteruletek?telepulesNev=Zalamerenye`

2: Otherwise check for settlement and street name. 

`GET /kozteruletek?telepulesNev=Budapest&kozteruletNev=Körmöci utca`

If result length is 1, the whole street belongs to one ballot office

3: Otherwise check for even or odd side of the street

`GET /kozteruletek?telepulesNev=Budapest&kozteruletNev=Logodi utca&kezdoHazszam={$lte: 78}&vegsoHazszam={$gt: 78}&megjegyzes=/Páros/`


4: Otherwise check 

`GET /kozteruletek?telepulesNev=Budapest&kozteruletNev=Logodi utca&kezdoHazszam={$lte: 78}&vegsoHazszam={$gt: 78}&megjegyzes=/Páros/`


### /scrape

Refresh the ballot office data from valasztas.hu and stores the source html.

`GET /scrape/5e405d6a0ff37a310a0840e7`

Parameters: scrapeOnly=true, parseFromDb=true


## Scripts

### Crawl ballot office urls

Crawl the ballot office urls and save to DB

`$ yarn crawl:onk2019`

you can reach the core url data on `GET /urls`

### Init ballot office DB

You can initialize the ballot office DB with the params parsed from urls:

`$ yarn initszk:onk2019`

you can reach the ballot office data on `GET /szavazokorok`


# Development

For python local testing you can manually start the parsing script with example data:
`python3 pythonScripts/parseSzkHtml.py htmls/irsapuszta.html`