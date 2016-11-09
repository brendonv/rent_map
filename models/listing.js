var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var listingSchema = new Schema({
    zillow_id: {type: String, index: true},
    property_type: {type: String, index: true, enum: ["BUILDINGS", "PROPERTIES"]},
    listing_type: {type: String, index: true, enum: ["RENTAL", "SALE"]},
    location: {
        type: {type: "String"},
        coordinates: [Number]
    }
});


var Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;