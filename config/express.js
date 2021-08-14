const express = require('express');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

module.exports = (app) => {
    app.engine('hbs', hbs({
        extname: '.hbs'
    }));

    app.set('view engine', 'hbs');
    app.use('/static', express.static('static'));
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
};