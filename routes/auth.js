const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const uploader = require("./../config/cloudinaryConfig")

const salt = 10;

router.post("/signin", (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((userDocument) => {
      if (!userDocument) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isValidPassword = bcrypt.compareSync(password, userDocument.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      req.session.currentUser = userDocument._id;
      res.redirect("/api/auth/isLoggedIn");
    })
    .catch(next);
});

router.post("/signup", (req, res, next) => {
  const { pseudo, avatar, region, email, password, role } = req.body;

  User.findOne({ email })
    .then((userDocument) => {
      if (userDocument) {
        return res.status(400).json({ message: "Email already taken" });
      }

      const hashedPassword = bcrypt.hashSync(password, salt);
      const newUser = { pseudo, avatar, region, email, password: hashedPassword ,role};
      // if (!req.file) newUser.avatar = undefined;
      // else newUser.avatar = req.file.path;
      User.create(newUser)
      .then((newUserDocument) => {
        /* Login on signup */
        
        req.session.currentUser = newUserDocument._id;
        req.session.currentUserRole = newUserDocument.role;
        
          console.log(newUserDocument);
          // console.log("avatar", newUserDocument.avatar)
          res.redirect("/api/auth/isLoggedIn");
        })
        .catch(next);
    })
    .catch(next);
});

router.post('/upload', uploader.single('avatar'), (req, res, next) => {
  if(!req.file) {
    next(new Error('Please choose a file'));
    return;
  }
  res.json({ secure_url: req.file.path })
})

router.get("/isLoggedIn", (req, res, next) => {
  if (!req.session.currentUser)
    return res.status(401).json({ message: "Unauthorized" });

  const id = req.session.currentUser;
  
  User.findById(id)
    .select("-password")
    .then((userDocument) => {
      res.status(200).json(userDocument);
    })
    .catch(next);
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(function (error) {
    if (error) next(error);
    else res.status(200).json({ message: "Succesfully disconnected." });
  });
});

module.exports = router;
