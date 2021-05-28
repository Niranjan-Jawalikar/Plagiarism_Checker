const express = require("express"),
    router = express.Router(),
    getMatchedElements = require("../helpers/getMatchedElements"),
    multer = require("multer"),
    upload = require("../Multer"),
    URL = require("../models/url"),
    { isLoggedIn } = require("../middleware"),
    User = require("../models/user"),
    getSource = require("../api"),
    path = require("path"),
    dirPathUploads = path.join(__dirname, "..", "uploads"),
    dirPathGoogle = path.join(__dirname, "..", "google"),
    fse = require("fs-extra");

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
        const { language, comment, searchTerm } = req.body;
        const urlObj = await URL.create({ language, comment, userId: req.user._id, searchTerm })
        const user = await User.findById(req.user._id).exec();
        user.urls.push(urlObj._id);
        await user.save();
        res.redirect(`/result/${urlObj._id}`);
    })
})

router.get("/result", isLoggedIn, async (req, res) => {
    const { urls } = await User.findById(req.user._id).populate("urls").exec();
    res.render("results/list", { urls })
})

router.get("/result/:id", isLoggedIn, async (req, res) => {
    let foundURLObj, sourceArray;
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
    if (!foundURLObj.url) {
        try {
            const { searchTerm, language } = foundURLObj;
            // showSpinner();
            sourceArray = await getSource(searchTerm, language);
        }
        catch (e) {
            console.log(e);
            // hideSpinner();
            req.flash("error", "Something went wrong.Please Try Again!");
            fse.emptyDirSync(dirPathUploads);
            fse.emptyDirSync(dirPathGoogle);
            await URL.findByIdAndDelete(req.params.id).exec();
            return res.redirect("back");
        }
    }
    try {
        const resulfOfMatchedElements = await getMatchedElements(foundURLObj, sourceArray);
        return res.render("results/result", resulfOfMatchedElements);
    }
    catch (resulfOfMatchedElements) {
        if (!resulfOfMatchedElements.error)
            return res.render("results/result", resulfOfMatchedElements);
        else {
            // hideSpinner();
            if (resulfOfMatchedElements.error && resulfOfMatchedElements.message)
                req.flash("error", resulfOfMatchedElements.message);
            else
                req.flash("error", "Something went wrong.Please Try Again!");
            fse.emptyDirSync(dirPathUploads);
            fse.emptyDirSync(dirPathGoogle);
            await URL.findByIdAndDelete(req.params.id).exec();
            return res.status(500).redirect("back");
        }

    }
})


const showSpinner = () => document.querySelector(".spinner-border").style.display = "block";
const hideSpinner = () => document.querySelector(".spinner-border").style.display = "none";

module.exports = router;