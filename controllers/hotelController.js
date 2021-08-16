const { body, validationResult } = require('express-validator');

const router = require('express').Router();

router.get('/create', (req, res) => {
    res.render('create');
});

router.post('/create',
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

module.exports = router;