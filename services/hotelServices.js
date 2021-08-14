const Hotel = require('../models/Hotel.js');

async function getAllHotels() {
    const hotels = await Hotel.find({}).lean();
    return hotels;
}

module.exports = {
    getAllHotels,
};