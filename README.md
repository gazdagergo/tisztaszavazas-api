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

*Find by match with multiple numeric properties*

`GET /szavazokorok?kozigEgyseg.megyeKod=1&telepules.telepulesKod=1&szavkorSorszam=12`

*Find by match of string within an Array of Objects*

Exact match
`/szavazokorok?kozteruletek.szkUtca=Gizellamajor`

Regex match
`/szavazokorok?kozteruletek.szkUtca=/Alagút u/i`

#### Initial fill of database with entries

`POST /szavazokorok`

*example body:* [szk.json](./utils/szk.json)

### /szavazokorok

#### Get all street sections

`GET /kozteruletek`

#### Query street sections (to seek for ballot office based on address)

Get the street section for the address. 

1: First check the name of settlement. If result length is 1, the whole settlement belongs to one ballot office.

`GET /kozteruletek?telepulesNev=Zalamerenye`

2: Otherwise check for settlement and street name. If result length is 1, the whole street belongs to one ballot office

`GET /kozteruletek?telepulesNev=Budapest&kozteruletNev=Körmöci utca`

3: Otherwise check for the house number

`GET /kozteruletek?telepulesNev=Budapest&kozteruletNev=Logodi utca&kezdoHazszam={$lte: 78}&vegsoHazszam={$gt: 78}&megjegyzes=/Páros/`

#### Get all settlements, countries or districts

`GET /kozigegysegek`

### /scrape

Refresh the ballot office data from valasztas.hu

`GET /scrape/5e405d6a0ff37a310a0840e7`


# Development

For python local testing you can manually start the parsing script with example data:
`python3 pythonScripts/parseSzkHtml.py htmls/irsapuszta.html`