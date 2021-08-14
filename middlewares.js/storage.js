const hotelServices = require('../services/hotelServices.js');

module.exports = () => (req, res, next) => {
    req.storage = {
        ...hotelServices
    };
    next();
};