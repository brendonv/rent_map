const mongoose = require('mongoose');
const Region = mongoose.model('Region');
const Listing = mongoose.model('Listing');
const Metrics = mongoose.model('Metrics');
const Aggregation = mongoose.model('Aggregation');
const moment = require('moment');
const util = require('util');
const _ = require('underscore');

exports.regions = (req, res) => {
    const city = req.query.city || "PORTLAND";

    Region.find({ city: city }).lean().exec((error, data) => {
        if (error) {
            console.log("ERROR: data.js regions", error);
            return res.status(400);
        }

        return res.json(data);
    })
}

exports.regionData = (req, res) => {
    let region = req.region || "ALL";
    // let aggregate = new Listing.aggregate();
    let matchObject = region._id ? { region: region._id } : {};
    console.log("regionData for date:", moment().subtract(1, "days").format('YYMMDD'));
    searchDate = moment().subtract(1, "days").format('YYMMDD');
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
        _.each(reduced, (propType) => {

        })
        reduced.totalListings = totalListings;
        reduced.totalAvailable = totalAvailable;
        console.log("\n\n",reduced,"\n\n");
        return res.json({data: reduced});
    });
    
}