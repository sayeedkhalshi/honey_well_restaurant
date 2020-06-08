const express = require("express");

const router = express.Router();

const Reservation = require("../../models/Reservation");
const Table = require("../../models/Table");
const ReservedDate = require("../../models/ReservedDate");
const Hour = require("../../models/Hour");

router.get("/", (req, res) => {
    res.redirect("/");
});

router.post("/", (req, res) => {
    const dateData = req.body.reserveddate.split(" ");
    const tableData = req.body.reservedtable.split(" ");
    const hourData = req.body.reservedhour.split(" ");
    const combination = dateData[1] + " " + hourData[1] + " " + tableData[1];

    //search for the combination if exists
    Reservation.findOne({ combination: combination }).then((combinations) => {
        const success = {};
        const errors = {};
        if (combinations) {
            errors.msg =
                "Already someone reserved this table in this time of the day. Please check what is not already reserved.";
            res.render("success", { errors });
        }
        if (!combinations) {
            ReservedDate.findOne({ opendate: dateData[1] }).then(
                (reserveddates) => {
                    if (!reserveddates) {
                        errors.msg =
                            "This date is not allowed by the restaurant to reserve.";
                        res.render("success", { errors });
                    }
                    if (reserveddates) {
                        Hour.findOne({ openhour: hourData[1] }).then(
                            (hours) => {
                                if (!hours) {
                                    errors.msg =
                                        "This hour is not allowed by the restaurant to reserve";
                                    res.render("success", { errors });
                                }
                                if (hours) {
                                    Table.findOne({
                                        tablenumber: tableData[1],
                                    }).then((tables) => {
                                        if (!tables) {
                                            errors.msg =
                                                "This table doesn't exist";
                                            res.render("success", { errors });
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
                                                            dateData[1],
                                                        reservedhour:
                                                            hourData[1],
                                                        reservedtable:
                                                            tableData[1],
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
                                                            dateData[1],
                                                        reservedhour:
                                                            hourData[1],
                                                        reservedtable:
                                                            tableData[1],
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
                                                    success.msg =
                                                        "Thanks for reservaing the table. One of our employee will call you to confirm your reservation";
                                                    res.render("success", {
                                                        success,
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
