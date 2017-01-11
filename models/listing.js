var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var listingSchema = new Schema({
    zillow_id: {type: String, index: true},
    name: String,
    property_type: {type: String, enum: ["BUILDING", "PROPERTY"]},
    listing_type: {type: String, enum: ["RENTAL", "SALE"]},
    location: {
        type: {type: "String"},
        coordinates: [Number] // [<Longitude>, <Latitude>]
    },
    thumbnail: String,
    region: {type: Schema.Types.ObjectId, ref: 'Region', index: true}
});



var Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;