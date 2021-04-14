const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Plagiarism_Checker', { useNewUrlParser: true, useUnifiedTopology: true });
const session = require("express-session");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(flash());
app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})



app.use(express.static(path.join(__dirname, "public")))
app.set("view engine", "ejs")


const indexRoutes = require("./routes");


app.use("/", indexRoutes);




const db = mongoose.connection;
db.on("error", () => console.log("Error!"))
db.once("open", () => {
    console.log("DB connected!");
})

app.listen(3000, () => {
    console.log("Server started on port 3000")
})