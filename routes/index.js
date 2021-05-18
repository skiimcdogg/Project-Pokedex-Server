const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("index");
});

module.exports = router;

// router.get("/", protectRoute, (req, res, next) => {
//   userModel
//     .findOne({ email: req.session.currentuser.email })
//     .populate("pokeFav")
//     .then((dbRes) => {
//       // console.log(dbRes);
//       res.render("users/my-page", dbRes);
//     })
//     .catch((err) => {
//       next(err);
//     });
// });
