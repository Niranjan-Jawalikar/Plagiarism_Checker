module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated())
            return next();
        req.flash("error", "Please login first!");
        return res.status(401).redirect("/login");

    }
}

