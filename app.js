const express = require("express"),
    app = express(),
    path = require("path"),
    mongoose = require('mongoose'),
    session = require("express-session"),
    flash = require("connect-flash"),
    bodyParser = require("body-parser"),
    passport = require("passport");


mongoose.connect('mongodb://localhost/Plagiarism_Checker', { useNewUrlParser: true, useUnifiedTopology: true });


app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.currentUser = req.user;
    next();
})




app.use(express.static(path.join(__dirname, "public")))
app.set("view engine", "ejs")


const indexRoutes = require("./routes/results"),
    authRoutes = require("./routes/auth");


app.use("/", indexRoutes);
app.use("/", authRoutes);




const db = mongoose.connection;
db.on("error", () => console.log("Error!"))
db.once("open", () => {
    console.log("DB connected!");
})

app.listen(3000, () => {
    console.log("Server started on port 3000")
})