const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const passport = require("passport");

const {
    ensureAuthenticated,
    forwardAuthenticated,
} = require("../../config/auth");

//load User model
const User = require("../../models/User");
const Table = require("../../models/Table");
const Hour = require("../../models/Hour");
const ReservedDate = require("../../models/ReservedDate");

router.get("/", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin") {
            res.render("admin/dashboard", { layout: "layoutAdmin" });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});
router.get("/users", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin") {
            res.render("admin/users-admin-panel");
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

router.get("/date", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin") {
            ReservedDate.find()
                .then((reserveddates) => {
                    const d = new Date();
                    const opendate = d.getDate();
                    const openmonth = d.getMonth();
                    res.render("admin/date-admin", {
                        opendate,
                        openmonth,
                        reserveddates,
                    });
                })
                .catch((err) => res.json({ msg: err }));
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

router.post("/date", ensureAuthenticated, (req, res) => {
    User.findOne({ email: req.user.email }).then((user) => {
        if (user.role === "admin" || user.role === "employee") {
            ReservedDate.findOne({
                opendate: req.body.opendate,
            }).then((reserveddate) => {
                if (reserveddate) {
                    res.json({ msg: "Date already exists" });
                }
                if (!reserveddate) {
                    const NewReservedDate = new ReservedDate({
                        opendate: req.body.opendate,
                        user: req.user.id,
                    });
                    NewReservedDate.save()
                        .then((reserveddate) => {
                            res.redirect("/admin/date");
                        })
                        .catch((err) => {
                            res.json({ msg: err });
                        });
                }
            });
        }
    });
});

router.get("/hours", (req, res) => {
    if (req.user) {
        if (req.user.role === "admin") {
            Hour.find().then((hours) => {
                res.render("admin/hour-admin", { hours });
            });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

router.get("/offers", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin") {
            res.render("admin/offers");
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

//@GET private admin
router.get("/table", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin") {
            Table.find().then((tables) => {
                res.render("admin/table-admin", { tables });
            });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

//@POST private admin new table
router.post("/table", ensureAuthenticated, (req, res) => {
    User.findOne({ email: req.user.email })
        .then((user) => {
            if (user) {
                if (user.role === "admin" || user.role === "employee") {
                    Table.findOne({ tablenumber: req.body.tablenumber }).then(
                        (tables) => {
                            if (tables) {
                                res.json({
                                    msg: "table number already exists",
                                });
                            } else {
                                //starts image upload
                                // Set The Storage Engine
                                const storage = multer.diskStorage({
                                    destination: "./public/uploads/",
                                    filename: function (req, file, cb) {
                                        cb(
                                            null,
                                            file.fieldname +
                                                "-" +
                                                Date.now() +
                                                path.extname(file.originalname)
                                        );
                                    },
                                });

                                // Init Upload
                                const upload = multer({
                                    storage: storage,
                                    limits: { fileSize: 1000000 },
                                    fileFilter: function (req, file, cb) {
                                        checkFileType(file, cb);
                                    },
                                }).single("tableimg");

                                // Check File Type
                                function checkFileType(file, cb) {
                                    // Allowed ext
                                    const filetypes = /jpeg|jpg|png|gif/;
                                    // Check ext
                                    const extname = filetypes.test(
                                        path
                                            .extname(file.originalname)
                                            .toLowerCase()
                                    );
                                    // Check mime
                                    const mimetype = filetypes.test(
                                        file.mimetype
                                    );

                                    if (mimetype && extname) {
                                        return cb(null, true);
                                    } else {
                                        cb("Error: Images Only!");
                                    }
                                }

                                //end image upload
                                upload(req, res, (err) => {
                                    if (err) {
                                        res.json({ msg: err });
                                    } else {
                                        if (req.file == undefined) {
                                            res.json({
                                                msg: "Error: No File Selected!",
                                            });
                                        } else {
                                            const newTable = new Table({
                                                tablenumber:
                                                    req.body.tablenumber,
                                                tablename: req.body.tablename,
                                                tableperson:
                                                    req.body.tableperson,
                                                user: req.user.id,
                                                tableimg: `uploads/${req.file.filename}`,
                                            });

                                            newTable
                                                .save()
                                                .then((tables) => {
                                                    res.json({ res: tables });
                                                })
                                                .catch((err) => {
                                                    res.json({ msg: err });
                                                });
                                        }
                                    }
                                });
                            }
                        }
                    );
                } else {
                    res.send("You need to be admin or employee to access this");
                }
            }
        })
        .catch((err) => res.send("no user found"));
});

//@POST private admin hour add
router.post("/hour", ensureAuthenticated, (req, res) => {
    User.findOne({ email: req.user.email })
        .then((user) => {
            if (user) {
                if (user.role === "admin" || user.role === "employee") {
                    const openhour =
                        req.body.starthour +
                        req.body.startmeridiem +
                        "-" +
                        req.body.endhour +
                        req.body.endmeridiem;
                    Hour.findOne({ openhour: openhour }).then((hour) => {
                        if (hour) {
                            res.json({ msg: "Hour already exist" });
                        }
                        if (!hour) {
                            const newHour = new Hour({
                                openhour: openhour,
                                user: req.user.id,
                            });
                            newHour
                                .save()
                                .then((hours) => {
                                    res.redirect("/admin/hours");
                                })
                                .catch((err) => res.json({ err: err }));
                        }
                    });
                } else {
                    res.send("You need to be admin or employee to access this");
                }
            }
        })
        .catch((err) => res.send("no user found"));
});

module.exports = router;
