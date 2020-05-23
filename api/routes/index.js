const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", { layout: "layout" });
});

router.get("/hwr", (req, res) => {
    res.render("hwr");
});

module.exports = router;
