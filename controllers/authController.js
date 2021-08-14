const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const authServices = require('../services/authServices.js');


router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login',
    body('username').custom(async val => {
        const username = await authServices.getUserByUsername(val);
        
        if (!username) {
            throw new Error('Username does not exist!');
        }
        return true;
    }),
    body('password', 'Password must be atleast 3 characters long').isLength({ min: 3 }),
    async (req, res) => {
        let { errors } = validationResult(req);

        try {
            if (errors.length) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            }
            await req.auth.login(req.body);
            res.redirect('/');
        } catch (err) {
            let ctx = {
                errors: err.message.split('\n'),
                data: {
                    username: req.body.username
                }
            };

            res.render('login', ctx);
        }
    });

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register',
    body('username').custom(async val => {
        let username = await authServices.getUserByUsername(val);
        if (username) {
            throw new Error('Username is already taken.');
        }
        return true;
    }),
    body('email').custom(async val => {
        let email = await authServices.getUserByEmail(val);
        if (email) {
            throw new Error('Email is already taken.');
        }
        return true;
    }),
    body('password', 'Password must be atleast 3 characters long').isLength({ min: 3 }),
    body('rePassword').custom((val, { req }) => {
        if (val !== req.body.password) {
            throw new Error('Passwords does not match!');
        }
        return true;
    }),
    async (req, res) => {
        let { errors } = validationResult(req);

        try {
            if (errors.length) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            }
            await req.auth.register(req.body);
            res.redirect('/');
        } catch (err) {
            let ctx = {
                errors: err.message.split('\n'),
                data: {
                    username: req.body.username,
                    email: req.body.email
                }
            };

            res.render('register', ctx);
        }
    });

router.get('/logout', (req, res) => {
    req.auth.logout();
    res.redirect('/');
});

module.exports = router;