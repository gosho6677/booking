const User = require("../models/User.js");


async function createUser(email, username, password) {
    const user = new User({ email, username, password });
    await user.save();
    return user;
}

async function getUserByUsername(username) {
    let re = new RegExp(`^${username}$`, 'i');
    return await User.findOne({ username: { $regex: re } }).populate('bookedHotels');
}

async function getUserByEmail(email) {
    let re = new RegExp(`^${email}$`, 'i');
    return await User.findOne({ email: { $regex: re } });
}

module.exports = {
    createUser,
    getUserByUsername,
    getUserByEmail,
};