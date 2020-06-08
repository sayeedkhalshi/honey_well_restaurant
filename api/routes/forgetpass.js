const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

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
                            const transporter = nodemailer.createTransport({
                                service: "gmail",
                                auth: {
                                    user: "unsocialideabarking@gmail.com",
                                    pass: "1990SuperCreative",
                                },
                            });

                            const body = {
                                from: "unsocialideabarking@gmail.com", // sender address
                                to: email, // list of receivers
                                subject:
                                    "Password reset link - HoneyWellRestaurant", // Subject line
                                html:
                                    "<h3>Link Expires in 2 hours</h3> <br> <h2>Honey Well Restaurant </h2> <br> <a href='http://honeywellrestaurant.abusayeed.me/forget-password/reset-link/" +
                                    forgot +
                                    "' >" +
                                    "<h2>Reset Password</h2></a>",
                            };

                            transporter.sendMail(body, (err, result) => {
                                if (err) {
                                    console.log(err);
                                    errors.email = "didn't happen, try again";
                                    res.render("forgetpass", {
                                        layout: "layout",
                                        errors,
                                        email,
                                    });
                                }
                                if (!err) {
                                    errors.email =
                                        "A reset link has been sent to your email";
                                    res.render("resetmessage", {
                                        layout: "layout",
                                        errors,
                                    });
                                }
                            });

                            //end nodemailer code
                        });
                    });
                });
            });
        }
    });
});

module.exports = router;
