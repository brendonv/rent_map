const PORTLAND_REGIONS = require('../data/portland/regions.json');

exports.regions = (req, res) => {
    const city = req.query.city || "portland";

    switch (city) {
        case "portland":
        default:
            return res.json({ data: PORTLAND_REGIONS });
    }
}

exports.regionData = (req, res) => {
    console.log('REGION DATA');
    return res.json({ data: {medianRent: 55, total: 175, buildings: 20, totalRooms: 345, properties: 45} });
}