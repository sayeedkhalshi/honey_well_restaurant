const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const {
    ensureAuthenticated,
    forwardAuthenticated,
} = require("../../config/auth");

//load validation
const validateRegisterInput = require("../../validation/register");

//load User model
const User = require("../../models/User");
const Reservation = require("../../models/Reservation");

//GET Private dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
    if (req.user) {
        User.findOne({ email: req.user.email })
            .then((user) => {
                if (!user) {
                    res.json({ msg: "user not found" });
                }
                if (user) {
                    Reservation.find({ email: req.user.email })
                        .then((reservations) => {
                            res.render("dashboard", {
                                layout: "layout",
                                user,
                                reservations,
                            });
                        })
                        .catch((err) => console.log(err));
                }
            })
            .catch((err) => res.json({ msg: "user not found" }));
    }
});

//GET public login
router.get("/login", forwardAuthenticated, (req, res) => {
    res.render("login", {
        layout: "layout",
        login_errors: req.session.messages || [],
    });
});

//GET public register
router.get("/register", forwardAuthenticated, (req, res) =>
    res.render("register", { layout: "layout" })
);

//GET public register
router.get("/register", forwardAuthenticated, (req, res) => {
    res.render("register");
});

//POST Register Public
router.post("/register", (req, res) => {
    const { name, phone, email, password, password2 } = req.body;
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        res.render("register", {
            layout: "layout",
            errors,
            name,
            phone,
            email,
            password,
            password2,
        });
    }

    User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            errors.email = "Email already exists. Try login instead";
            res.render("login", {
                layout: "layout",
                errors,
                email,
                password,
            });
        } else {
            if (req.body.password == req.body.password2) {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    phone: req.body.phone,
                    role: "customer",
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt).then((hash) => {
                        newUser.password = hash;
                        newUser
                            .save()
                            .then((user) => {
                                errors.email = "Registered | You can login now";
                                res.render("login", {
                                    layout: "layout",
                                    errors,
                                    email,
                                    password,
                                });
                            })
                            .catch((err) => {
                                res.status(400);
                            });
                    });
                });
            } else {
                errors.password = "Password doesn't match";
            }
        }
    });
});

// Login
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: req.session.returnTo || "/",
        failureRedirect: "/user/login",
        failureMessage: "Invalid username or password",
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
