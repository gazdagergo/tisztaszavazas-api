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

Get all ballot office
```
GET
/szavazokorok
```

Get a single ballot office
```
GET
/szavazokorok/5e405d6a0ff37a310a0840dd
```

Query ballot offices
```
GET
/szavazokorok?telepules.megyeKod=1&telepules.telepulesKod=1&szavkorSorszam=12
```

Adds the list of available ballot offices with codes
```
POST
/szavazokorok
```

*example body:* [szk.json](./utils/szk.json)



### /scrape

Refresh the ballot office data from valasztas.hu
```
GET
/scrape/5e405d6a0ff37a310a0840e7
```
