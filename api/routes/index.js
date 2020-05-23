const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", { layout: "layout" });
});

router.get("/fullname", (req, res) => {
    res.render("fullname");
});

module.exports = router;
