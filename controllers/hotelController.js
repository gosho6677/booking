const { body, validationResult } = require('express-validator');
const { isAuthorized, isOwner } = require('../middlewares.js/guards.js');

const router = require('express').Router();

router.get('/create', isAuthorized(), (req, res) => {
    res.render('create');
});

router.post('/create',
    isAuthorized(),
    body('hotel', 'Hotel name must be atleast 4 characters long.').isLength({ min: 4 }),
    body('city', 'Hotel name must be atleast 3 characters long.').isLength({ min: 3 }),
    body('imageUrl', 'Image must be a valid URL.').isURL(),
    body('freeRooms', 'Rooms must be between 1 and 100').toInt().isLength({ min: 1, max: 100 }),
    async (req, res) => {
        let { errors } = validationResult(req);
        let hotel = {
            name: req.body.hotel,
            city: req.body.city,
            imageUrl: req.body.imageUrl,
            freeRooms: req.body.freeRooms,
            ownerId: req.user._id
        };
        try {
            if (errors.length) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            }

            await req.storage.createHotel(hotel);
            res.redirect('/');
        } catch (err) {
            let ctx = {
                errors: err.message.split('\n'),
                hotel
            };

            res.render('create', ctx);
        }
    });


router.get('/details/:id', async (req, res) => {
    const hotelId = req.params.id;
    const hotel = await req.storage.getHotelById(hotelId);
    const isOwner = hotel.ownerId === req.user._id;
    const hasBooked = hotel.bookedBy.filter(h => h._id == req.user._id);

    res.render('details', { hotel, isOwner, hasBooked: hasBooked.length === 1 });
});

router.get('/edit/:id', isOwner(), async (req, res) => {
    const hotelId = req.params.id;
    const hotel = await req.storage.getHotelById(hotelId);

    res.render('edit', { hotel });
});

router.post('/edit/:id',
    isOwner(),
    body('hotel', 'Hotel name must be atleast 4 characters long.').isLength({ min: 4 }),
    body('city', 'Hotel name must be atleast 3 characters long.').isLength({ min: 3 }),
    body('imageUrl', 'Image must be a valid URL.').isURL(),
    body('freeRooms', 'Rooms must be between 1 and 100').toInt().isLength({ min: 1, max: 100 }),
    async (req, res) => {
        let { errors } = validationResult(req);
        let hotelId = req.params.id;
        let hotel = {
            name: req.body.hotel,
            city: req.body.city,
            imageUrl: req.body.imageUrl,
            freeRooms: req.body.freeRooms,
        };
        console.log(hotel);
        try {
            if (errors.length) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            }

            await req.storage.editHotel(hotel, hotelId);
            res.redirect('/');
        } catch (err) {
            let ctx = {
                errors: err.message.split('\n'),
                hotel
            };

            res.render('edit', ctx);
        }
    });

router.get('/book/:id', async (req, res) => {
    const hotelId = req.params.id;
    const userId = req.user._id;

    await req.storage.bookHotel(userId, hotelId);
    res.redirect(`/hotels/details/${hotelId}`);
});

router.get('/delete/:id', async (req, res) => {
    const hotelId = req.params.id;
    const userId = req.user._id;

    await req.storage.deleteHotel(userId, hotelId);
    res.redirect('/');
});

module.exports = router;