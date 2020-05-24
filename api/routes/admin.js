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

router.get("/", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin") {
            res.render("admin/dashboard", { layout: "layoutAdmin" });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});
router.get("/users", ensureAuthenticated, (req, res) =>
    res.render("admin/users-admin-panel")
);

router.get("/date", ensureAuthenticated, (req, res) =>
    res.render("admin/date-admin")
);
router.get("/hours", (req, res) => res.render("admin/hour-admin"));

router.get("/offers", ensureAuthenticated, (req, res) => {
    res.render("admin/offers");
});

//@GET private admin
router.get("/table", ensureAuthenticated, (req, res) => {
    Table.find().then((tables) => {
        res.render("admin/table-admin", { tables });
    });
});

//@POST private admin new table
router.post("/new-table", ensureAuthenticated, (req, res) => {
    Table.findOne({ tablenumber: req.body.tablenumber }).then((tables) => {
        if (tables) {
            res.json({ msg: "table number already exists" });
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
                    path.extname(file.originalname).toLowerCase()
                );
                // Check mime
                const mimetype = filetypes.test(file.mimetype);

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
                            tablenumber: req.body.tablenumber,
                            tablename: req.body.tablename,
                            tableperson: req.body.tableperson,
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
    });
});

module.exports = router;
