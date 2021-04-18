const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const LocalStrategy = require("passport-local");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.get("/register", (req, res) => {
    res.render("auth/register");
})

router.post("/register", (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome!");
            res.redirect("/");
        })

    })
})

router.get("/login", (req, res) => {
    res.render("auth/login");
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => { }
)

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
})

module.exports = router;