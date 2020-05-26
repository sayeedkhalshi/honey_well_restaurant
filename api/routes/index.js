const express = require("express");
const Table = require("../../models/Table");
const router = express.Router();

router.get("/", (req, res) => {
    ReservedDate.find()
        .then((reserveddates) => {
            const d = new Date();
            Hour.find().then((hours) => {
                Table.find().then((tables) => {
                    res.render("index", {
                        layout: "layout",
                        reserveddates,
                        d,
                        hours,
                        tables,
                    });
                });
            });
        })
        .catch((err) => res.json({ msg: err }));
});

router.get("/hwr", (req, res) => {
    res.render("hwr");
});

module.exports = router;
