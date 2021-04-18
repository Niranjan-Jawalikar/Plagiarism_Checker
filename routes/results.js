const express = require("express")
const router = express.Router();
const getMatchedElements = require("../getMatchedElements");
const multer = require("multer");
const upload = require("../Multer");
const URL = require("../models/url");
const { isLoggedIn } = require("../middleware");
const User = require("../models/user");

router.get("/", (req, res) => {
    res.render("home");
})

router.post("/", isLoggedIn, async (req, res) => {
    upload(req, res, async (err) => {
        if (req.fileValidationError) {
            req.flash("error", req.fileValidationError)
            return res.redirect("back");
        }
        else if (err instanceof multer.MulterError) {
            req.flash("error", err)
            return res.redirect("back");
        }
        else if (err) {
            req.flash("error", err)
            return res.redirect("back");
        }
        const urlObj = await URL.create({ language: req.body.language, comment: req.body.comment, userId: req.user._id })
        const user = await User.findById(req.user._id).exec();
        user.urls.push(urlObj._id);
        await user.save();
        res.locals.currentPage = "result";
        res.redirect(`/result/${urlObj._id}`);
    })
})

router.get("/result", isLoggedIn, async (req, res) => {
    const { urls } = await User.findById(req.user._id).populate("urls").exec();
    res.render("results/list", { urls })
})

router.get("/result/:id", isLoggedIn, async (req, res) => {
    let foundURLObj;
    try {
        foundURLObj = await URL.findById(req.params.id).exec();
    }
    catch (e) {
        req.flash("error", "Invalid url");
        res.redirect("back");
    }
    if (!foundURLObj) {
        req.flash("error", "Invalid url");
        return res.redirect("back");
    }
    else if (!foundURLObj.userId.equals(req.user._id)) {
        req.flash("error", "Unauthorized user");
        return res.redirect("back");
    }
    try {
        const resulfOfMatchedElements = await getMatchedElements(foundURLObj);
        return res.render("results/result", resulfOfMatchedElements);
    }
    catch (resulfOfMatchedElements) {
        return res.render("results/result", resulfOfMatchedElements);
    }
})


module.exports = router;