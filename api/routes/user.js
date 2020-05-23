const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const {
    ensureAuthenticated,
    forwardAuthenticated,
} = require("../../config/auth");

//load User model
const User = require("../../models/User");

//GET public login
router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

//GET public register
router.get("/register", forwardAuthenticated, (req, res) =>
    res.render("register")
);

//GET public register
router.get("/register", forwardAuthenticated, (req, res) =>
    res.render("register")
);

//POST Register Public
router.post("/register", (req, res) => {
    const errors = [];
    User.findOne(
        { email: req.body.email } || { username: req.body.username }
    ).then((user) => {
        if (user) {
            errors.push({
                msg: "Username Or Email Already Exist. Try Login instead",
            });
        } else {
            if (req.body.password == req.body.password2) {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    phone: req.body.phone,
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt).then((hash) => {
                        newUser.password = hash;
                        newUser
                            .save()
                            .then((user) => {
                                res.redirect("/login");
                            })
                            .catch((err) => {
                                res.status(400);
                            });
                    });
                });
            } else {
                errors.push({ msg: "Password doesn't match" });
            }
        }
    });
});

// Login
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: req.session.returnTo || "/",
        failureRedirect: "/login",
        failureFlash: true,
    })(req, res, next);
    delete req.session.returnTo;
});

// Logout
router.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy(() => {
        res.redirect("/");
    });
});

module.exports = router;
