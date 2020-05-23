const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/", (req, res) =>
    res.render("admin/dashboard", { layout: "layoutAdmin" })
);
router.get("/users", (req, res) => res.render("admin/users-admin-panel"));
router.get("/table", (req, res) => res.render("admin/table-admin"));
router.get("/date", (req, res) => res.render("admin/date-admin"));
router.get("/hours", (req, res) => res.render("admin/hour-admin"));

router.get("/offers", (req, res) => {
    res.render("admin/offers");
});

module.exports = router;
