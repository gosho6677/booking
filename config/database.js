const mongoose = require('mongoose');
const { CONNECTION_STRING } = require('./config.js');

module.exports = (app) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const db = mongoose.connection;

        db.on('error', err => {
            console.error('Database error =>', err.message);
            reject(err.message);
        });

        db.once('open', () => {
            console.log('Database connected.');
            resolve();
        });
    });
};