const isGuest = () => (req, res, next) => {
    if(!req.user) {
        next();
    } else {
        res.redirect('/');
    }
};

const isAuthorized = () => (req, res, next) => {
    if(req.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

module.exports = {
    isGuest,
    isAuthorized
};