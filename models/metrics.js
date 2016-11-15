var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var metricsSchema = new Schema({
    data: [],
    listing: { type: Schema.Types.ObjectId, ref: 'Listing', index: true },
    date: String
});



var Metrics = mongoose.model('Metrics', metricsSchema);
module.exports = Metrics;