const express = require("express");
const Table = require("../../models/Table");
const Reservation = require("../../models/Reservation");
const router = express.Router();

router.get("/", (req, res) => {
    //reservation data push
    ReservedDate.find()
        .then((reserveddates) => {
            const d = new Date();
            Hour.find().then((hours) => {
                Table.find()
                    .then((tables) => {
                        if (req.user) {
                            const name = req.user.name;
                            const email = req.user.email;
                            const phone = req.user.phone;

                            res.render("index", {
                                layout: "layout",
                                reserveddates,
                                d,
                                hours,
                                tables,
                                name,
                                email,
                                phone,
                            });
                        }
                        if (!req.user) {
                            res.render("index", {
                                layout: "layout",
                                reserveddates,
                                d,
                                hours,
                                tables,
                            });
                        }
                    })
                    .catch((err) => console.log(err));
            });
        })
        .catch((err) => res.json({ msg: err }));
});

router.get("/hwr", (req, res) => {
    res.render("hwr");
});

module.exports = router;
