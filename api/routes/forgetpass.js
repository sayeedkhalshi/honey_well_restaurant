const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

//load model
const User = require("../../models/User");
const ForgetPass = require("../../models/ForgetPass");

//@GET authorized reset link
router.get("/reset-link/:hash", (req, res) => {
    res.render("authorized-link", { layout: "layout" });
});

router.post("/reset-link", (req, res) => {
    const errors = {};
    ForgetPass.findOne({ forgot: req.body.forgot }).then((forgetpass) => {
        if (forgetpass) {
            User.findOne({ email: forgetpass.email }).then((user) => {
                if (!user) {
                    errors.email = "Token expired. It takes 2 hours to expire";
                }
                if (user) {
                    //for error form again
                    const forgot = req.body.forgot;
                    const password = req.body.password;
                    const password2 = req.body.password2;
                    if (req.body.password != req.body.password2) {
                        errors.email = "Password must match";
                        res.render("authorized-link", {
                            layout: "layout",
                            forgot,
                            password,
                            password2,
                            errors,
                        });
                    }
                    if (req.body.password === req.body.password2) {
                        if (!req.body.password.length > 5) {
                            errors.email =
                                "Password must be greater than 6 character";
                            res.render("authorized-link", {
                                layout: "layout",
                                forgot,
                                password,
                                password2,
                                errors,
                            });
                        }
                        if (req.body.password.length > 5) {
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(
                                    req.body.password,
                                    salt,
                                    (err, hash) => {
                                        User.findByIdAndUpdate(
                                            user.id,
                                            { password: hash },
                                            { new: true }
                                        ).then((user) => {
                                            errors.email =
                                                "You are all set. Now login";
                                            res.render("login", {
                                                layout: "layout",
                                                errors,
                                            });
                                        });
                                    }
                                );
                            });
                        }
                    }
                }
            });
        }
        if (!forgetpass) {
            errors.email = "Token expired. It takes 2 hours to expire";
        }
    });
});

//@GET public forget-password email form
router.get("/", (req, res) => {
    res.render("forgetpass", { layout: "layout" });
});

//@POST public forget-password
router.post("/", (req, res) => {
    const email = req.body.email;
    const errors = {};
    User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
            errors.email = "Email doesn't belong to any account";
            res.render("forgetpass", { layout: "layout", errors, email });
        }
        if (user) {
            const newForgetPass = new ForgetPass({
                email: email,
            });

            newForgetPass.save().then((forgetpass) => {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(forgetpass.id, salt, (err, hash) => {
                        ForgetPass.findByIdAndUpdate(
                            forgetpass.id,
                            { forgot: hash },
                            { new: true }
                        ).then((forgetpass) => {
                            const forgot = forgetpass.forgot;

                            //nodemailer link creation and mail sending here
                            res.render("forgetpass", {
                                layout: "layout",
                                forgot,
                            });
                        });
                    });
                });
            });
        }
    });
});

module.exports = router;
