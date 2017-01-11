const moment   = require('moment');
const mongoose = require('mongoose');
const config   = require('../config/config');
const util     = require('util');
const async    = require('async');
const _        = require('underscore');

require('../models/listing');
require('../models/region');
require('../models/metrics');
require('../models/aggregation');

const Region   = mongoose.model('Region');
const Listing  = mongoose.model('Listing');
const Metrics  = mongoose.model('Metrics');
const Aggregation  = mongoose.model('Aggregation');

const args = process.argv.slice(2);

/**
 * COMMAND-LINE USAGE
 *
 * node scripts/aggregate.js [options]
 *
 * DESCRIPTION
 *
 * Transforms scraped json data into applicable mongo document. Currently supports Zillow data.
 *
 * OPTIONS
 *
 *      -d , --date 
 *               Run aggregation for given date, where date is in the form YYMMDD.
 *
 *
 * EXAMPLE 
 *
 *      node scripts/aggregate.js -d 161120
 *
 */

/*
 * Expose API
 */

exports.runAggregation = runAggregation;

/*
 * Base function
 */

function runAggregation(date, callback, dbConnection) {
    console.log("RUN Aggregation:", date);
    let cb = callback || function done(){ console.log("FINISHED AGGREGATION.");  process.exit(); };
    if (!dbConnection) {
        openMongoDBConnection(() => getRegions(date, cb));
    } else {
        getRegions(date, cb);
    }
}

/**
 * Helpers
 */

function getRegions(date, callback) {
    Region.find({ city: "PORTLAND" }, (error, regions) => {
        if (error || regions.length === 0) {
            console.log("Error retrieving regions:", error);
            return;
        }
        regions.push('ALL'); //Run for all regions -- probably should make a doc
        async.eachOfSeries(regions, (region, index, callback) => {
            aggregateData(region, date, callback);
        }, (error) => {
            callback();
        });
    });
}

function aggregateData(r, date, callback) {
    if (!date) return console.log("Error: no date provided to runAggregation");
    
    let searchDate = date;
    let region = r || "ALL";
    let matchObject = region._id ? { region: region._id } : {};
    console.log("Aggregate:", r.name, date);
    Listing
    .aggregate({ $match: matchObject })
    .project({property_type: 1})  //Restrict to only Listing fields we need
    .lookup({ from: 'metrics', localField: "_id", foreignField: "listing", as: "data" })
    .unwind("$data")
    .match({ "data.date": { $eq: searchDate } })
    .group({
        _id: { property: "$property_type", bedrooms: "$data.bd" },
        averagePrice: { $avg: "$data.price" },
        availableUnits: { $sum: "$data.avail" },
        total: { $sum: 1 }
    })
    .exec( (error, result) => {
        console.log(result);
        // return;

        // _.map(result, (mem, item) => {
        //     mem[item.property_type]
        // }, {})

        return callback();

        let totalListings = 0;
        let totalAvailable = 0;
        const reduced = _.reduce(result, (mem, item) => {
            const propertyType = item._id && item._id.property;
            const bedrooms = item._id && item._id.bedrooms;
            if (!propertyType || !bedrooms) return mem;
            const dataValues = { averagePrice: item.averagePrice, total: item.total, availableUnits: item.availableUnits };
            totalListings += dataValues.total;
            totalAvailable += dataValues.availableUnits;
            mem[propertyType] ? mem[propertyType][bedrooms] = dataValues : (mem[propertyType] = {}, mem[propertyType][bedrooms] = dataValues);
            return mem;
        }, {});

        async.eachOfSeries(reduced, (dataObject, propType, cb) => {
            let newAggregate = new Aggregation({
                property_type: propType,
                total_listings: totalListings,
                total_units: totalAvailable,
                date: searchDate,
                data: dataObject
            });
            if (region._id) newAggregate.region = region._id;
            newAggregate.save((error, doc) => {
                if (error) console.log("Error saving aggregation:", error);
                cb();
            })
        }, (error) => {
            callback();
        });
    });
}

/**
 * DB Helper
 */

function openMongoDBConnection(callback) {
    mongoose.connect(config.mongoDB);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      console.log("successfully opened");
      callback();
    });
}

//Execute runAggregation if called from command line
if (!module.parent) {
    if (args[0] === "-d" || args[0] === "--date" && args[1]) {
        if (args[1].split("").length !== 6) {
            console.log("ERROR: Incorrect date format. Must be in the form YYMMDD.");
            process.exit(1);
        }
        runAggregation(args[1], null, false);
    } else {
        console.log("ERROR: Incorrect usage. Check file.");
        process.exit(1);
    }
}
