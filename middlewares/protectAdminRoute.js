module.exports = function protectPrivateRoute(req, res, next) {
    console.log(req.session.currentUserRole)
    if (req.session.currentUserRole === "admin") next();
    else console.log("error");
};