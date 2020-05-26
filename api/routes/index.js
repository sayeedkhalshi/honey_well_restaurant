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
                        //start disabled algoritms
                        Reservation.findOne({
                            reserveddate: req.body.reserveddate,
                        }).then((reserveddates) => {
                            const hourCount = 0;
                            if (hours != "undefined") {
                                hours.forEach((hour) => {
                                    hourCount += 1;
                                });
                            }
                            const tableCount = 0;
                            if (tables != "undefined") {
                                tables.forEach((table) => {
                                    tableCount += 1;
                                });
                            }
                        });

                        //end disbled algorithms

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
