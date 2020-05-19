const express = require("express");
const app = express();
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

//load routes
const index = require("./api/routes/index");
const user = require("./api/routes/user");
const reservations = require("./api/routes/reservations");

//db config
db = require("./config/keys").mongoURI;

//connect mongo
mongoose
    .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log("mongoose connected"))
    .catch((err) => console.log(err));

//set static
app.use(express.static(__dirname + "/public"));

//set view
app.use(expressLayouts);
app.set("view engine", "ejs");

//routes
app.use("/", index);
app.use("/user", user);
app.use("/reservations", reservations);

//port
const PORT = process.env.PORT || 4999;

//start server
app.listen(PORT, console.log(`server started at ${PORT}`));
