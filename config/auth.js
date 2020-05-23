const User = require("../models/User");

module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.session.returnTo = req.originalUrl;
        res.redirect("/user/login");
    },
    forwardAuthenticated: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }

        if (req.user.role === "admin") {
            res.redirect("/admin");
        } else {
            res.redirect("/");
        }
    },
};
