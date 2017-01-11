const fs        = require('fs');
const path      = require('path');
const request   = require('request');
const async     = require('async');
const moment    = require('moment');
const mongoose  = require('mongoose');
const config    = require('../config/config');
const util      = require('util');
const aggregate = require('./aggregate');

require('../models/listing');
require('../models/region');
require('../models/metrics');

const Region   = mongoose.model('Region');
const Listing  = mongoose.model('Listing');
const Metrics  = mongoose.model('Metrics');

const args = process.argv.slice(2);

const CITY = 'PORTLAND';

mongoose.connect(config.mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', (cb) => {
  console.log("successfully opened");
});

/**
 * COMMAND-LINE USAGE
 *
 * node scripts/transform.js [options]
 *
 * DESCRIPTION
 *
 * Transforms scraped json data into applicable mongo document. Currently supports Zillow data.
 *
 * OPTIONS
 *
 *      -d , --directory 
 *               Transform given directory's files. Path relative to project's root.
 *
 *      -f, --file
 *               Transform given file. Path relative to project's root.
 *
 *
 * EXAMPLE 
 *
 *      node scripts/transform.js -d /data/portland/scraped
 *
 *      node scripts/transform.js -f /data/portland/scraped/zillow_2016-11-20T13:46:42-08:00.json
 *
 */

/*
 * Expose API
 */

exports.transformFile = transformFile;
exports.transformDirectory = transformDirectory;

/*
 * Base functions
 */

function transformDirectory(dirname) {
    const dirPath = path.dirname(__dirname); // returns full path to root, e.g. /Users/brendonverissimo/Development/Zillow
    const fullPath = path.join(dirPath, dirname);

    console.log(fullPath);

    fs.readdir(fullPath, (error, filenames) => {
        if (error) {
            console.log("ERROR: transformDirectory", error);
            return;
        }

        async.eachOfSeries(filenames, (file, index, callback) => {
            transformFile(file, fullPath, callback);
        }, err => {
            console.log("DONE");
            process.exit();
        });

    });
}

function transformFile(filename, fullPath = "", callback) {
    if (!filename && callback) return callback();

    let fp = fullPath || path.dirname(__dirname);
    let cb = callback || function(){ console.log("DONE"); process.exit(); };

    fs.readFile(path.join(fp, filename), 'utf8', (error, body) => {
        if (error) {
            console.log("ERROR: transformFile readFile", error);
            return cb();
        }

        scrapedToMongoDB(body, filename, cb);

    });
}

/*
 * Helper functions
 */

function scrapedToMongoDB(json, filename, callback) {
    let date = filename.split("_")[1];
    date = date.split(".")[0];
    date = moment(date).format("YYMMDD");

    console.log("TRANSFORMING FILE: ", filename);

    let data;
    try {
        data = JSON.parse(json);
    } catch (error) {
        //do something
        console.log("ERROR: parsing file JSON", error);
        return callback();;
    }

    async.eachOfSeries(data, (region, index, cb) => {
        const regionName = region.region && region.region.NAME;

        if (!regionName) {
            console.log("ERROR: no region name.");
            return cb();
        }

        Region.findOne({ name: regionName, city: CITY }, (error, doc) => {
            if (error) {
                console.log("ERROR: scrapedToMongoDB REgion.findOne", error);
                return;
            }

            if (!doc) {
                //create region
                const newRegion = new Region({
                    name: regionName,
                    city: CITY,
                    zillow_region_id: region.region.REGIONID
                });

                newRegion.save((error, saved) => {
                    if (error) {
                        console.log("ERROR: Saving newRegion", error);
                        return;
                    }
                    listingsForRegion(saved, region, date, cb);
                });
            } else {
                listingsForRegion(doc, region, date, cb);
            }

        });
    }, error => {
        aggregate.runAggregation(date, callback, true); //Run the aggregation script with the newly created data
    });
}

function listingsForRegion(region, data, date, callback) {
    let done = false;
    async.eachOfSeries(data.properties, (property, index, cb) => {
        let priceData = {
            "bd": property[8][1], //Bedroom
            "ba": property[8][2], //Bath
            "sq_ft": property[8][3], //Square feet
            "avail": 1,    //Available units
            "price": toNumber(property[8][0]) //Price
        };
        Listing.findOne({ zillow_id: property[0] }, (err, listing) => {
            if (err) {
                console.log("ERROR: listingsForRegion Listing.findOne", err);
                return;
            }

            if (!listing) {
                const newListing = new Listing({
                    zillow_id: property[0],
                    property_type: 'PROPERTY',
                    listing_type: 'RENTAL',
                    location: {
                        coordinates: [property[2], property[1]]
                    },
                    thumbnail: property[8][5],
                    region: region._id
                });

                newListing.save((err, savedListing) => {
                    if (err) {
                        console.log("ERROR: listingsForRegion Listing.findOne", err);
                        return cb();
                    }

                    dataForListing(savedListing, priceData, date, cb);
                });
            } else {

                dataForListing(listing, priceData, date, cb);
            }
        });
    }, error => {
        done ? callback() : done = true;
    });
    async.eachOfSeries(data.buildings, (building, index, cb) => {
        let dataObject = {
            "bd": building[4][3], //Bedroom
            "ba": building[4][4], //Bath
            "sq_ft": building[4][5], //Square feet
            "avail": building[2],    //Available units
            "price": toNumber(building[4][0]) //Price
        };
        Listing.findOne({ zillow_id: building[5] }, (err, listing) => {
            if (err) {
                console.log("ERROR: listingsForRegion Listing.findOne", err);
                return;
            }

            if (!listing) {
                const newListing = new Listing({
                    zillow_id: building[5],
                    name: building[4][2],
                    property_type: 'BUILDING',
                    listing_type: 'RENTAL',
                    location: {
                        coordinates: [building[1], building[0]]
                    },
                    thumbnail: building[4][1],
                    region: region._id
                });

                newListing.save((err, savedListing) => {
                    if (err) {
                        console.log("ERROR: listingsForRegion Listing.findOne", err);
                        return cb();
                    }

                    dataForListing(savedListing, dataObject, date, cb);
                });
            } else {

                dataForListing(listing, dataObject, date, cb);
            }
        });
    }, error => {
        done ? callback() : done = true;
    });
}

function dataForListing(listing, data, date, callback) {
    Metrics.findOne({ listing: listing._id, date: date }, (err, metric) => {
        if (err) {
            console.log("ERROR: dataForListing", err);
            return callback();
        }

        if (!metric) {
            let metric = new Metrics(data);

            metric.date = date;
            metric.listing = listing._id;

            metric.save((err, savedMetric) => {
                if (err) {
                    console.log("ERROR: dataForListing", err);
                }
                callback();
            });
        } else {
            //Already recorded. Do nothing
            callback();
        }
    });
}

function toNumber(s) {
    let regExArray = s.split(/^\$([0-9,]+).+/);
    let rent = regExArray[1].replace(",", "");
    return parseInt(rent);
}

function regionsJSONToMongoDB() {
    
}

//Execute calculatePortfolio if called from command line
if (!module.parent) {
    if (args[0] === "-d" || args[0] === "--directory" && args[1]) {
        transformDirectory(args[1]);
    } else if (args[0] === "-f" || args[0] === "--file" && args[1]) {
        transformFile(args[1], null);
    } else {
        console.log("ERROR: Incorrect usage. Check file.");
        process.exit(1);
    }
}