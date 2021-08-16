const Hotel = require('../models/Hotel.js');
const User = require('../models/User.js');

async function getAllHotels() {
    const hotels = await Hotel.find({}).lean();
    return hotels;
}

async function getHotelById(id) {
    const hotel = await Hotel.findById(id).populate('bookedBy').lean();
    return hotel;
}

async function createHotel(body) {
    const hotel = new Hotel(body);
    const userId = body.ownerId;
    const user = await User.findById(userId);

    user.offeredHotels.push(hotel);

    await user.save();
    await hotel.save();

    return hotel;
}

async function editHotel(body, id) {
    const existing = await Hotel.findById(id);

    if (!existing) {
        throw new Error('No such ID in database');
    }

    Object.assign(existing, body);
    existing.save();
}

async function deleteHotel(userId, id) {
    let user = await User.findById(userId);

    let idxOfOffered = user.offeredHotels.indexOf(id);
    let idxOfBooked = user.offeredHotels.indexOf(id);
    user.offeredHotels.splice(idxOfOffered, 1);
    user.bookedHotels.splice(idxOfBooked, 1);
    
    await user.save();
    await Hotel.findByIdAndDelete(id);
}

async function bookHotel(userId, hotelId) {
    let user = await User.findById(userId);
    let hotel = await Hotel.findById(hotelId);

    user.bookedHotels.push(hotel);
    hotel.bookedBy.push(user);

    await user.save();
    await hotel.save();
}

module.exports = {
    getAllHotels,
    createHotel,
    getHotelById,
    deleteHotel,
    bookHotel,
    editHotel,
};