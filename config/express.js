const express = require('express');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const authMiddleware = require('../middlewares.js/authMiddleware.js');
const storage = require('../middlewares.js/storage.js');

module.exports = (app) => {
    app.engine('hbs', hbs({
        extname: '.hbs'
    }));

    app.set('view engine', 'hbs');
    app.use('/static', express.static('static'));
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(authMiddleware());
    app.use(storage());
};