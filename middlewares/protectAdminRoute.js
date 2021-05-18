module.exports = function protectPrivateRoute(req, res, next) {
    if (req.session.currentuser.role === "admin") next();
    else res.render("forbidden");
};