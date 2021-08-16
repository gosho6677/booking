const Hotel = require('../models/Hotel.js');

async function getAllHotels() {
    const hotels = await Hotel.find({}).lean();
    return hotels;
}

async function createHotel(body) {
    const hotel = await new Hotel(body);
    await hotel.save();
    return hotel;
}

module.exports = {
    getAllHotels,
    createHotel,
};