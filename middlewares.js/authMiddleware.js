const { COOKIE_NAME, TOKEN_SECRET } = require("../config/index.js");
const authServices = require('../services/authServices.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = () => (req, res, next) => {
    req.auth = {
        register: async ({ email, username, password }) => {
            const token = await registerToken(email, username, password);
            res.cookie(COOKIE_NAME, token, { httpOnly: true });
        },
        login: async ({ username, password }) => {
            const token = await loginToken(username, password);
            res.cookie(COOKIE_NAME, token, { httpOnly: true });
        },
        logout: () => {
            res.clearCookie(COOKIE_NAME);
        }
    };

    if (verifyToken(req, res)) {
        next();
    }
};

async function registerToken(email, username, password) {
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await authServices.createUser(email, username, hashedPassword);
    return createToken(user);
}

async function loginToken(username, password) {
    const user = await authServices.getUserByUsername(username);
    const passMatch = await bcrypt.compare(password, user.password);

    if (!passMatch) {
        throw new Error('Incorrect password!');
    }

    return createToken(user);
}

function createToken(user) {
    const userViewModel = {
        _id: user._id,
        username: user.username,
        email: user.email
    };
    const token = jwt.sign(userViewModel, TOKEN_SECRET);

    return token;
}

async function verifyToken(req, res) {
    const token = req.cookies[COOKIE_NAME];

    if (token) {
        try {
            const verifiedData = jwt.verify(token, TOKEN_SECRET);
            if (!verifiedData) {
                throw new Error('Token verification failed.');
            }
            req.user = verifiedData;
            res.locals.user = verifiedData;
        } catch (err) {
            res.clearCookie(COOKIE_NAME);
            res.redirect('/auth/login');
            return false;
        }
    }
    return true;
}