const { isAuthorized } = require('../middlewares.js/guards.js');

const router = require('express').Router();

router.get('/', async (req, res) => {
    const hotels = await req.storage.getAllHotels();
    res.render('home', { hotels });
});

router.get('/profile', isAuthorized(), async (req, res) => {
    const bookedHotels = await req.auth.getUserBookedHotels(req.user.username);
    res.render('profile', { bookedHotels });
});

module.exports = router;