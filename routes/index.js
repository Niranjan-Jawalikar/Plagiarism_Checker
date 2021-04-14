const express = require("express")
const router = express.Router();
const getMatchedElements = require("../getMatchedElements");
const multer = require("multer");
const upload = require("../Multer");
const URL = require("../models/url");

router.get("/", (req, res) => {
    res.render("home");
})

router.post("/", async (req, res) => {
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
        const url = await URL.create({ language: req.body.language, comment: req.body.comment })
        res.redirect(`/result/${url._id}`);
    })
})

// router.get("/result",(req,res,next)=>{

// })

router.get("/result/:id", async (req, res) => {
    const foundURL = await URL.findById(req.params.id).exec();
    if (!foundURL)
        return res.send("Invalid url");
    try {
        const resulfOfMatchedElements = await getMatchedElements(foundURL);
        return res.render("result", resulfOfMatchedElements);
    }
    catch (resulfOfMatchedElements) {
        return res.render("result", resulfOfMatchedElements);
    }
})


module.exports = router;