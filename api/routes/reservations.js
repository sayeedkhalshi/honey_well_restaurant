const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("reservation");
});

router.post("reservation", (req, res) => {
    Reservation.findOne({ reserveddate: req.body.reserveddate }).then(
        (reserveddates) => {
            if (reserveddates) {
            }
        }
    );
});

module.exports = router;
