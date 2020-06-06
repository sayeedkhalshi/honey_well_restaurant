const express = require("express");
const Table = require("../../models/Table");
const Reservation = require("../../models/Reservation");
const router = express.Router();

router.get("/tables", (req, res) => {
    Table.find().then((tables) => {
        res.render("table-lightbox", { layout: "layout", tables });
    });
});

router.get("/", (req, res) => {
    //reservation data push
    ReservedDate.find({ time: "future" })
        .then((reserveddates) => {
            const d = new Date();
            Hour.find()
                .then((hours) => {
                    Table.find()
                        .then((tables) => {
                            Reservation.find({ time: "future" }).then(
                                (reservations) => {
                                    res.render("index", {
                                        layout: "layout",
                                        reserveddates,
                                        d,
                                        hours,
                                        tables,
                                        reservations,
                                    });
                                }
                            );
                        })
                        .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => res.json({ msg: err }));
});

router.get("/hwr", (req, res) => {
    res.render("hwr");
});

module.exports = router;
