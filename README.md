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


### /scrape

Refresh the ballot office data from valasztas.hu

`GET /scrape/5e405d6a0ff37a310a0840e7`


# Development

For python local testing you can manually start the parsing script with example data:
`python3 pythonScripts/parseSzkHtml.py htmls/irsapuszta.html`