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

## Zillow Data

###Structure

<Array>[# of regions]:
    <Object>
        buildings:<Array>[# of buildings in region]
            <Array>[6]
                0: Lat <Int>
                1: Lng <Signed Long Int>
                2: Available Units <Int>
                3: 6 <Int>
                4: <Array>[6]
                    0: Price /mo <String>
                    1: Thumbnail <String>
                    2: Property Name <String>
                    3: Bedrooms <Int>
                    4: Bathrooms <Int>
                    5: Sqft <Int>
                5: Zillow Id <String>[6]  (Optional)
        communities:<Array>[0]
        favorties:<Array>[0]
        mapResultsMode:<String>
        nearbyBuildings:<Array>[0]
        nearbyProperties:<Array>[0]
        properties:<Array>[# of properties in region]
            <Array>[9]
                0: Zillow Id <Long Int>
                1: Lat <Int>
                2: Lng <Signed Long Int>
                3: Rounded Price <String>
                4: 6 <Int>
                5: 0 <Int>
                6: 0 <Int>
                7: 0 <Int>
                8: <Array>[11]
                    0: Price /mo <String>
                    1: Bedrooms <Int>
                    2: Bathrooms <Int>
                    3: Sqft <Int>
                    4: false <Boolean>
                    5: Thumbnail <String>
                    6: "--" <String>
                    7: "" <String>
                    8: "ForRent" <String>
                    9: "For Rent" <String>
                    10: <Int> (believe this is used for ordering results)
        region:<Object>
        regions:<Array>[0]

#### Note: thumbnail URL
    http://photos.zillowstatic.com/p_a/ISeks3agghfeqi1000000000.jpg
    The returned url is for a 50x50 px thumbnail. 

    For larger photo, use "p_e":
    http://photos.zillowstatic.com/p_e/ISeks3agghfeqi1000000000.jpg


## Trulia Data

GET: https://www.trulia.com/_ajax/SRP/SRP/json/?url=%2Ffor_rent%2F5718_nh

## Webpack Vendor (Front End) Dependencies

Must update webpack.config.js 
entry.vendor array to include desired front-end dependency