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

const isOwner = () => async (req, res, next) => {
    let hotel = await req.storage.getHotelById(req.params.id);

    if(req.user && hotel && (req.user._id === hotel.ownerId)) {
        next();
    } else {
        res.redirect('/');
    }
};

module.exports = {
    isGuest,
    isAuthorized,
    isOwner
};