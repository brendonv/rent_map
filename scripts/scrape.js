const fs = require('fs');
const path = require('path');
const request = require('request');
const async = require('async');
const moment = require('moment');
const transform = require('./transform');

const args = process.argv.slice(2);
// const PORTLAND_REGIONS = require('../data/portland/regions.json');
let REGIONS;

function getRentalData(city = "portland") {

    const fileURL = path.dirname(__dirname) + '/data/' + city + '/scraped/zillow_' + moment().format() + '.json';

    //Support dynamic region data
    REGIONS = require('../data/' + city + '/regions.json');
    if (!REGIONS) {
      console.log("ERROR: getting region JSON for city: ", city);
      return;
    }

    async.eachOfSeries(REGIONS, function(object, index, callback) {
        const rid = object.REGIONID;
        callZillow(getURL(rid), object, index, fileURL, callback);
    }, function(err) {
        if (err) console.log("ERROR: ", err);

        transform.transformFile(fileURL, null, null);
    });

};

function callZillow(url, region, index, fileURL, callback) {
    let body = '';
    request
      .get(url)
      // .on('response', function(response) {
      //   console.log(response.statusCode) // 200
      // })
      .on('error', function() {
        console.log("ERROR");
      })
      .on('data', function(chunk) {
          body += chunk
      })
      .on('end', function() {
        processData(body, region, index, fileURL, callback);
      })
}

//This function takes a series of JSON-parsed objects and prepares/appends them to file
function processData(body, region, index, fileURL, callback) {

    fs.readFile(fileURL, function(err, fileData) {

        if (err) console.log("Error reading file");

        let data;

        try {
            data = JSON.parse(body);
        } catch (e) {
            console.log('ERROR parsing file');
        }

        //NOTE: Zillow-specific data property
        data.map.region = region;

        let content = JSON.stringify(data.map);

        if (index === 0) content = "[" + content;
        if (index === REGIONS.length - 1) content += "]";

        if (index > 0) content = "," + content;

        fs.appendFile(fileURL, content, 'utf8', function(err) {
            if (err) console.log("Error");
            callback();
        });
    });

}

function getURL(rid) {
    return `http://www.zillow.com/search/GetResults.htm?spt=homes&status=000010&lt=000000&ht=011000&pr=,&mp=,&bd=0%2C&ba=0%2C&sf=,&lot=0%2C&yr=,&singlestory=0&hoa=0%2C&pho=0` +
            `&pets=0&parking=0&laundry=0&income-restricted=0&pnd=0&red=0&zso=0&days=any&ds=all&pmf=0&pf=0&sch=100111` +
            `&rect=-122921391,45393869,-122387181,45692751&p=1&sort=days&search=map&rid=${rid}&rt=8&listright=true&isMapSearch=1&zoom=11`
}

//CALL GETRENTALDATA
let city = args[0];
getRentalData(city);