const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const {
    ensureAuthenticated,
    forwardAuthenticated,
} = require("../../config/auth");

//load User model
const User = require("../../models/User");
const Table = require("../../models/Table");

router.get("/", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin") {
            res.render("admin/dashboard", { layout: "layoutAdmin" });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});
router.get("/users", (req, res) => res.render("admin/users-admin-panel"));
router.get("/table", (req, res) => res.render("admin/table-admin"));
router.get("/date", (req, res) => res.render("admin/date-admin"));
router.get("/hours", (req, res) => res.render("admin/hour-admin"));

router.get("/offers", (req, res) => {
    res.render("admin/offers");
});

//@POST private admin new table
router.post("/new-table", ensureAuthenticated, (req, res) => {
    Table.findOne({ tablenumber: req.body.tablenumber }).then((tables) => {
        if (tables) {
            req.json({ msg: "table number already exists" });
        } else {
            const newTable = new Table({
                tablenumber: req.body.tablenumber,
                tablename: req.body.tablename,
                tableperson: req.body.tableperson,
                user: req.user.id,
            });
        }
    });
});

module.exports = router;
