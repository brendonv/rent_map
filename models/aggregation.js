var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var aggregationSchema = new Schema({
    property_type: {type: String, enum: ["BUILDING", "PROPERTY"], index: true},
    region: {type: Schema.Types.ObjectId, ref: 'Region', index: true},
    total_listings: Number,
    total_units: Number,
    data: [],
    date: String
});

aggregationSchema.index({ property_type: 1, region: 1 });

var Aggregation = mongoose.model('Aggregation', aggregationSchema);
module.exports = Aggregation;