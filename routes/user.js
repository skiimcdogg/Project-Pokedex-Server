const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Pokemon = require("../models/Pokemon");
const protectRoute = require("../middlewares/protectRoute");
const protectAdmin = require("../middlewares/protectAdminRoute");
const uploader = require("../config/cloudinaryConfig")

router.get("/user", protectRoute, (req, res, next) => {
  User.findOne({ _id: req.session.currentUser })
    .populate("pokeFav pokeTeam")
    .then((dbRes) => {
      console.log(dbRes);
      res.status(200).json(dbRes);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch(
  "/user/edit/:id",
  uploader.single("avatar"),
  // protectRoute,
  
  (req, res, next) => {
    console.log("REQPARAMAS", req.params);
    console.log("REQBODY", req.body);
    console.log("req",req)
    console.log("reqfile",req.file)
    const { pseudo, email, region } = req.body;
    const updatedUser = {
      pseudo,
      email,
      region
    }
    if (req.file) {
      updatedUser.avatar = req.file.path;
    }
    console.log("newUserbefore", updatedUser)

    User.findByIdAndUpdate(req.params.id, updatedUser, { new: true })
      .then((updatedDocument) => {
        console.log("NewUserafter", updatedUser);
        // res.redirect("/api/auth/isLoggedIn");
        res.status(200).json(updatedDocument);
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.delete("/user/delete/:id", protectRoute, (req, res, next) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => {
      console.log("user deleted");
      // res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
});

router.delete("/user/deleteFav/:id/pokemon", protectRoute, (req, res, next) => {
  Pokemon.findByIdAndDelete(req.params.id)
    .then((dbRes) => {
      console.log("1er then", dbRes);
      const pokeId = dbRes._id;
      User.findOneAndUpdate(
        { _id: req.session.currentUser },
        { $pull: { pokeFav: pokeId } },
        { new: true }
      )
        .then((dbRes2) => {
          console.log("2nd then", dbRes2);
          res.status(200).json(dbRes2);
          //    res.redirect("/users")
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});

router.delete(
  "/user/deleteTeam/:id/pokemon",
  protectRoute,
  (req, res, next) => {
    Pokemon.findByIdAndDelete(req.params.id)
      .then((dbRes) => {
        console.log(dbRes);
        const pokeId = dbRes._id;
        User.findOneAndUpdate(
          { _id: req.session.currentUser },
          { $pull: { pokeTeam: pokeId } },
          { new: true }
        )
          .then((dbRes2) => {
            console.log("DBRES2", dbRes2);
            res.status(200).json(dbRes2);
            //    res.redirect("/users")
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.patch("/user/edit/:id/pokemon", protectRoute, (req, res, next) => {
  Pokemon.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      // res.redirect("/users");
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/user/all", protectAdmin, (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete("/user/adminDelete/:id", protectAdmin, (req, res, next) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).json({ message: "User deleted" });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
