const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

//load passport config
require("./config/passport")(passport);

//body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//load routes
const index = require("./api/routes/index");
const user = require("./api/routes/user");
const reservations = require("./api/routes/reservations");
const admin = require("./api/routes/admin");

//db config
db = require("./config/keys").mongoURI;

//connect mongo
mongoose
    .connect(db, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => console.log("mongoose connected"))
    .catch((err) => console.log(err));

//set static
app.use(express.static(__dirname + "/public"));

//set view
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "layoutAdmin");

// Express session
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);

//passport config
app.use(passport.initialize());
app.use(passport.session());

//isAuthenticated for views
app.use(function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

//routes
app.use("/", index);
app.use("/user", user);
app.use("/reservations", reservations);
app.use("/admin", admin);

//port
const PORT = process.env.PORT || 4999;

//start server
app.listen(PORT, console.log(`server started at ${PORT}`));
