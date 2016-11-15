var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var regionSchema = new Schema({
    name: { type: String, index: true },
    zillow_region_id: Number,
    city: String
});


var Region = mongoose.model('Region', regionSchema);
module.exports = Region;