# Scraped Data

Stored in directory under /data/{city name}/scraped

To add new city:
1. Add city name to /data/cities/index.js
2. cd *path_to_project*/data/ && mkdir {city name} && mkdir {city name}/scraped
3. Add regions.json in city directory with neighborhood data

To scrape city data:
node *path_to_root*/scripts/scrape {city name}

## City of Portland Permit Data

POST: https://www.portlandmaps.com/api/permit.cfm

form data: 
api_key:7D700138A0EA40349E799EA216BF82F9
format:json
sort_field:address
sort_order:ASC
action:permits
debug:0
search_type_id:2
neighborhood:
neighborhood_coalition:
business_association:
date_type:issued
date_from:
date_to:
page:1

api_key=7D700138A0EA40349E799EA216BF82F9&format=json&sort_field=address&sort_order=ASC&action=permits&debug=0&search_type_id=2&neighborhood=&neighborhood_coalition=&business_association=&date_type=issued&date_from=&date_to=&page=1

## Trulia Data

GET: https://www.trulia.com/_ajax/SRP/SRP/json/?url=%2Ffor_rent%2F5718_nh

## Webpack Vendor (Front End) Dependencies

Must update webpack.config.js 
entry.vendor array to include desired front-end dependency