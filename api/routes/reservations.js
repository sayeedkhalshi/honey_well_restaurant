const express = require("express");

const router = express.Router();

const Reservation = require("../../models/Reservation");
const Table = require("../../models/Table");
const ReservedDate = require("../../models/ReservedDate");
const Hour = require("../../models/Hour");
const Combination = require("../../models/Combination");

router.get("/", (req, res) => {
    res.render("reservation");
});

router.post("/", (req, res) => {
    const dateData = req.body.reserveddate.split(" ");
    const tableData = req.body.reservedtable.split(" ");
    const hourData = req.body.reservedhour.split(" ");
    const combination = dateData[1] + " " + hourData[1] + " " + tableData[1];

    //search for the combination if exists
    Reservation.findOne({ combination: combination }).then((combinations) => {
        if (combinations) {
            res.json({ msg: "already reserved" });
        }
        if (!combinations) {
            ReservedDate.findOne({ opendate: dateData[1] }).then(
                (reserveddates) => {
                    if (!reserveddates) {
                        res.json({
                            msg:
                                "This date is not allowed by the restaurant to reserve",
                        });
                    }
                    if (reserveddates) {
                        Hour.findOne({ openhour: hourData[1] }).then(
                            (hours) => {
                                if (!hours) {
                                    res.json({
                                        msg:
                                            "This hour is not allowed by the restaurant to reserve",
                                    });
                                }
                                if (hours) {
                                    Table.findOne({
                                        tablenumber: tableData[1],
                                    }).then((tables) => {
                                        if (!tables) {
                                            res.json({
                                                msg: "This table doesn't exist",
                                            });
                                        }
                                        if (tables) {
                                            let newReservation;

                                            if (req.user) {
                                                newReservation = new Reservation(
                                                    {
                                                        combination:
                                                            dateData[1] +
                                                            " " +
                                                            hourData[1] +
                                                            " " +
                                                            tableData[1],
                                                        user: req.user.id,
                                                        reserveddate:
                                                            dateData[0],
                                                        reservedhour:
                                                            hourData[0],
                                                        reservedtable:
                                                            tableData[0],
                                                        email: req.body.email,
                                                        phone: req.body.phone,
                                                        name: req.body.name,
                                                        status: "pending",
                                                    }
                                                );
                                            }
                                            if (!req.user) {
                                                newReservation = new Reservation(
                                                    {
                                                        combination:
                                                            dateData[1] +
                                                            " " +
                                                            hourData[1] +
                                                            " " +
                                                            tableData[1],
                                                        reserveddate:
                                                            dateData[0],
                                                        reservedhour:
                                                            hourData[0],
                                                        reservedtable:
                                                            tableData[0],
                                                        email: req.body.email,
                                                        phone: req.body.phone,
                                                        name: req.body.name,
                                                        status: "pending",
                                                    }
                                                );
                                            }

                                            //save reservation
                                            newReservation
                                                .save()
                                                .then((reservation) => {
                                                    res.json({
                                                        msg: reservation,
                                                    });
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                });
                                        }
                                    });
                                }
                            }
                        );
                    }
                }
            );
        }
    });
});

module.exports = router;
