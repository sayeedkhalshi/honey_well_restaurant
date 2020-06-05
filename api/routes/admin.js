const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const {
    ensureAuthenticated,
    forwardAuthenticated,
} = require("../../config/auth");

//load User model
const User = require("../../models/User");
const Table = require("../../models/Table");
const Hour = require("../../models/Hour");
const ReservedDate = require("../../models/ReservedDate");
const Reservation = require("../../models/Reservation");
const Cancell = require("../../models/Cancell");

//Served
router.get("/served", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin" || req.user.role === "employee") {
            Reservation.find({ time: "future" }).then((reservations) => {
                res.render("admin/reservations/served", {
                    layout: "layoutAdmin",
                    reservations,
                });
            });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});
router.post("/served", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin" || req.user.role === "employee") {
            Reservation.findOneAndUpdate(
                { combination: req.body.servedvalue },
                { servedby: req.user.id, status: "served" },
                { new: true }
            ).then((reservation) => {
                res.redirect("/admin/ongoing");
            });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

//cancell
router.get("/cancelled", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin" || req.user.role === "employee") {
            Cancell.find().then((reservations) => {
                res.render("admin/reservations/cancelled", {
                    layout: "layoutAdmin",
                    reservations,
                });
            });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});
router.post("/cancell", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin" || req.user.role === "employee") {
            Reservation.findOne({ combination: req.body.cancellvalue })
                .then((reservation) => {
                    if (!reservation) {
                        res.redirect("/admin/pending");
                    }
                    if (reservation) {
                        Cancell.findOne({
                            combination: req.body.cancellvalue,
                        })
                            .then((cacelledreservation) => {
                                if (cacelledreservation) {
                                    res.redirect("/admin/pending");
                                }
                                if (!cacelledreservation) {
                                    const newCancelled = new Cancell({
                                        combination: reservation.combination,
                                        name: reservation.name,
                                        email: reservation.email,
                                        phone: reservation.phone,
                                        status: "cancelled",
                                        cacelledby: req.user.id,
                                    });
                                    newCancelled
                                        .save()
                                        .then((cancelledReservation) => {
                                            console.log("Cancell created");
                                            Reservation.deleteOne({
                                                combination:
                                                    req.body.cancellvalue,
                                            })
                                                .then(() => {
                                                    console.log("deleted");
                                                    res.redirect(
                                                        "/admin/pending"
                                                    );
                                                })
                                                .catch((err) =>
                                                    console.log(err)
                                                );
                                        });
                                }
                            })
                            .catch((err) => console.log(err));
                    }
                })
                .catch((err) => console.log(err));
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

//special
router.post("/special", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin" || req.user.role === "employee") {
            Reservation.findOneAndUpdate(
                { combination: req.body.servedvalue },
                { specialby: req.user.id, special: "yes" },
                { new: true }
            ).then((reservation) => {
                res.redirect("/admin/pending");
            });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});
router.get("/special", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin" || req.user.role === "employee") {
            Reservation.find({ time: "future" }).then((reservations) => {
                res.render("admin/reservations/special", {
                    layout: "layoutAdmin",
                    reservations,
                });
            });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

//find reservations by id
router.get("/reservations/:comb", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin" || req.user.role === "employee") {
            Reservation.find({ combination: req.params.comb })
                .then((reservations) => {
                    res.render("admin/reservations/single", {
                        layout: "layoutAdmin",
                        reservations,
                    });
                })
                .catch((err) => console.log(err));
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

//ongoing reservation
router.get("/ongoing", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin" || req.user.role === "employee") {
            Reservation.find({ time: "future" }).then((reservations) => {
                res.render("admin/reservations/ongoing", {
                    layout: "layoutAdmin",
                    reservations,
                });
            });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});
router.post("/ongoing", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin" || req.user.role === "employee") {
            Reservation.findOneAndUpdate(
                { combination: req.body.ongoingvalue },
                { ongoingby: req.user.id, status: "ongoing" },
                { new: true }
            ).then((reservation) => {
                res.redirect("/admin");
            });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

//Pending reservation
router.get("/pending", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin" || req.user.role === "employee") {
            Reservation.find({ time: "future" }).then((reservations) => {
                res.render("admin/reservations/pending", {
                    layout: "layoutAdmin",
                    reservations,
                });
            });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

router.post("/confirm", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin" || req.user.role === "employee") {
            Reservation.findOneAndUpdate(
                { combination: req.body.confirmvalue },
                { confirmedby: req.user.id, status: "confirmed" },
                { new: true }
            ).then((reservation) => {
                res.redirect("/admin");
            });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

//Confirmed reservation
router.get("/confirmed", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin" || req.user.role === "employee") {
            Reservation.find({ time: "future" }).then((reservations) => {
                res.render("admin/reservations/confirmed", {
                    layout: "layoutAdmin",
                    reservations,
                });
            });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

//Cancelled reservation
router.get("/cancelled", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin" || req.user.role === "employee") {
            Reservation.find({ time: "future" }).then((reservations) => {
                res.render("admin/reservations/cancelled", {
                    layout: "layoutAdmin",
                    reservations,
                });
            });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

//dashboard
router.get("/", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin" || req.user.role === "employee") {
            Reservation.find({ time: "future" }).then((reservations) => {
                res.render("admin/reservations/pending", {
                    layout: "layoutAdmin",
                    reservations,
                });
            });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

//users
router.get("/users", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin") {
            res.render("admin/users-admin-panel");
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

//user admin section private only admin customers
router.get("/users/customer", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin") {
            User.find({ role: "customer" }).then((users) => {
                res.render("admin/users/customers", {
                    layout: "layoutAdmin",
                    users,
                });
            });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

//user admin section private only admin customers
router.get("/users/admin", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin") {
            User.find({ role: "admin" }).then((users) => {
                res.render("admin/users/admins", {
                    layout: "layoutAdmin",
                    users,
                });
            });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});
//user admin section private only admin customers
router.get("/users/employee", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin") {
            User.find({ role: "employee" }).then((users) => {
                res.render("admin/users/employees", {
                    layout: "layoutAdmin",
                    users,
                });
            });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

//users POST private only admin
router.post("/users", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin") {
            User.findOne({ email: req.body.email })
                .then((user) => {
                    if (user) {
                        res.redirect("/admin/users");
                    }
                    if (!user) {
                        if (req.body.password === req.body.password2) {
                            const newUser = new User({
                                name: req.body.name,
                                email: req.body.email,
                                phone: req.body.phone,
                                role: req.body.role,
                                password: req.body.password,
                            });

                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt
                                    .hash(req.body.password, salt)
                                    .then((hash) => {
                                        newUser.password = hash;

                                        newUser
                                            .save()
                                            .then((user) => {
                                                res.redirect("/admin/users");
                                            })
                                            .catch((err) => console.log(err));
                                    });
                            });
                        } else {
                            res.json({ msg: "password did not match" });
                        }
                    }
                })
                .catch((err) => console.log(err));
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

//restaurant private for date hour and table
router.get("/restaurant", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin" || req.user.role === "employee") {
            ReservedDate.find()
                .then((reserveddates) => {
                    const d = new Date();

                    res.render("admin/date-admin", {
                        reserveddates,
                        d,
                    });
                })
                .catch((err) => res.json({ msg: err }));
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

//dates admin

router.get("/date", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin" || req.user.role === "employee") {
            ReservedDate.find()
                .then((reserveddates) => {
                    const d = new Date();

                    res.render("admin/date-admin", {
                        reserveddates,
                        d,
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
            //mark time as past in ReservedDate model
            ReservedDate.find({ time: "future" }).then((reserveddates) => {
                reserveddates.forEach((reserveddate) => {
                    const d = new Date();

                    const reserveddate_array = reserveddate.opendate.split("-");
                    const year = reserveddate_array[0];
                    const month = reserveddate_array[1];
                    const day = reserveddate_array[2];
                    const dateboolean =
                        year < d.getFullYear() ||
                        (year == d.getFullYear() && month < d.getMonth() + 1) ||
                        (year == d.getFullYear() &&
                            month == d.getMonth() + 1 &&
                            day < d.getDate());

                    if (dateboolean) {
                        ReservedDate.findByIdAndUpdate(
                            reserveddate.id,
                            { time: "past" },
                            { new: true }
                        )
                            .then((reserveddate) => {
                                console.log(reserveddate + " updated");
                            })
                            .catch((err) => console.log(err));
                    }
                });
            });

            //mark time as past in Reservation model
            Reservation.find({ time: "future" }).then((reservations) => {
                if (reservations) {
                    reservations.forEach((reservation) => {
                        const d = new Date();
                        const combination = reservation.combination.split(" ");
                        const dateCombination = combination[0].split("-");

                        const year = dateCombination[0];
                        const month = dateCombination[1];
                        const day = dateCombination[2];
                        const dateboolean =
                            year < d.getFullYear() ||
                            (year == d.getFullYear() &&
                                month < d.getMonth() + 1) ||
                            (year == d.getFullYear() &&
                                month == d.getMonth() + 1 &&
                                day < d.getDate());

                        if (dateboolean) {
                            Reservation.findByIdAndUpdate(
                                reservation.id,
                                { time: "past" },
                                { new: true }
                            )
                                .then((reservations) => {
                                    console.log(reservations + " updated");
                                })
                                .catch((err) => console.log(err));
                        }
                    });
                }
            });

            //create new date
            ReservedDate.findOne({
                opendate: req.body.opendate,
            }).then((reserveddate) => {
                if (reserveddate) {
                    res.json({ msg: "Date already exists" });
                }
                if (!reserveddate) {
                    const d = new Date();
                    const reserveddate_array = req.body.opendate.split(" ");

                    const year = reserveddate_array[0];
                    const month = reserveddate_array[1];
                    const day = reserveddate_array[2];
                    const dateboolean =
                        year < d.getFullYear() ||
                        (year == d.getFullYear() && month < d.getMonth() + 1) ||
                        (year == d.getFullYear() &&
                            month == d.getMonth() + 1 &&
                            day < d.getDate());

                    if (dateboolean) {
                        res.json({ msg: "You can't have a day in the past" });
                    }
                    if (!dateboolean) {
                        const NewReservedDate = new ReservedDate({
                            opendate: req.body.opendate,
                            user: req.user.id,
                        });
                        NewReservedDate.save()
                            .then((reserveddate) => {
                                res.json({ msg: reserveddate });
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

router.get("/hours", (req, res) => {
    if (req.user) {
        if (req.user.role === "admin" || req.user.role === "employee") {
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
        if (req.user.role === "admin" || req.user.role === "employee") {
            res.render("admin/offers");
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

//@GET private admin
router.get("/table", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin" || req.user.role === "employee") {
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

//reservations admin private only admin
router.get("/reservations", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin") {
            Reservation.find().then((reservations) => {
                res.render("admin/reservations/reservations", { reservations });
            });
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

//search reservation only admin
router.post("/reservations", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin") {
            //When search term is name
            if (req.body.searchterm === "name") {
                Reservation.find({ name: req.body.search }).then(
                    (reservations) => {
                        if (!reservations) {
                            res.render("admin/reservations/reservations", {
                                reservations,
                            });
                        }
                        if (reservations) {
                            res.render("admin/reservations/reservations", {
                                reservations,
                            });
                        }
                    }
                );
            }
            //When search term is email
            if (req.body.searchterm === "email") {
                Reservation.find({ email: req.body.search }).then(
                    (reservations) => {
                        if (!reservations) {
                            res.render("admin/reservations/reservations", {
                                reservations,
                            });
                        }
                        if (reservations) {
                            res.render("admin/reservations/reservations", {
                                reservations,
                            });
                        }
                    }
                );
            }
            //When search term is phone
            if (req.body.searchterm === "phone") {
                Reservation.find({ phone: req.body.search }).then(
                    (reservations) => {
                        if (!reservations) {
                            res.render("admin/reservations/reservations", {
                                reservations,
                            });
                        }
                        if (reservations) {
                            res.render("admin/reservations/reservations", {
                                reservations,
                            });
                        }
                    }
                );
            }

            //When search term is date
            if (req.body.searchterm === "date") {
                Reservation.find({ reserveddate: req.body.search }).then(
                    (reservations) => {
                        if (!reservations) {
                            res.render("admin/reservations/reservations", {
                                reservations,
                            });
                        }
                        if (reservations) {
                            res.render("admin/reservations/reservations", {
                                reservations,
                            });
                        }
                    }
                );
            }

            //When search term is hour
            if (req.body.searchterm === "hour") {
                Reservation.find({ reservedhour: req.body.search }).then(
                    (reservations) => {
                        if (!reservations) {
                            res.render("admin/reservations/reservations", {
                                reservations,
                            });
                        }
                        if (reservations) {
                            res.render("admin/reservations/reservations", {
                                reservations,
                            });
                        }
                    }
                );
            }

            //When search term is Table
            if (req.body.searchterm === "table") {
                Reservation.find({ reservedtable: req.body.search }).then(
                    (reservations) => {
                        if (!reservations) {
                            res.render("admin/reservations/reservations", {
                                reservations,
                            });
                        }
                        if (reservations) {
                            res.render("admin/reservations/reservations", {
                                reservations,
                            });
                        }
                    }
                );
            }
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

//search reservation only admin
router.post("/users/customer", ensureAuthenticated, (req, res) => {
    if (req.user) {
        if (req.user.role === "admin") {
            //When search term is name
            if (req.body.searchterm === "name") {
                User.find({ name: req.body.search }).then((users) => {
                    if (!users) {
                        res.render("admin/users/customers", {
                            users,
                        });
                    }
                    if (users) {
                        res.render("admin/users/customers", {
                            users,
                        });
                    }
                });
            }
            //When search term is email
            if (req.body.searchterm === "email") {
                User.find({ email: req.body.search }).then((users) => {
                    if (!users) {
                        res.render("admin/users/customers", {
                            users,
                        });
                    }
                    if (users) {
                        res.render("admin/users/customers", {
                            users,
                        });
                    }
                });
            }
            //When search term is phone
            if (req.body.searchterm === "phone") {
                User.find({ phone: req.body.search }).then((users) => {
                    if (!users) {
                        res.render("admin/users/customers", {
                            users,
                        });
                    }
                    if (users) {
                        res.render("admin/users/customers", {
                            users,
                        });
                    }
                });
            }

            //When search term is date
            if (req.body.searchterm === "date") {
                User.find({ reserveddate: req.body.search }).then((users) => {
                    if (!users) {
                        res.render("admin/users/customers", {
                            users,
                        });
                    }
                    if (users) {
                        res.render("admin/users/customers", {
                            users,
                        });
                    }
                });
            }

            //When search term is hour
            if (req.body.searchterm === "hour") {
                User.find({ reservedhour: req.body.search }).then((users) => {
                    if (!users) {
                        res.render("admin/users/customers", {
                            users,
                        });
                    }
                    if (users) {
                        res.render("admin/users/customers", {
                            users,
                        });
                    }
                });
            }

            //When search term is Table
            if (req.body.searchterm === "table") {
                User.find({ reservedtable: req.body.search }).then((users) => {
                    if (!users) {
                        res.render("admin/users/customers", {
                            users,
                        });
                    }
                    if (users) {
                        res.render("admin/users/customers", {
                            users,
                        });
                    }
                });
            }
        } else {
            res.send("Need to be a admin to access this page");
        }
    }
});

module.exports = router;
