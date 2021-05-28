const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Pokemon = require("../models/Pokemon");
const protectRoute = require("../middlewares/protectRoute");
const protectAdmin = require("../middlewares/protectAdminRoute");
const uploader = require("../config/cloudinaryConfig");

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
  protectRoute,
  uploader.single("avatar"),
  (req, res, next) => {
    const { pseudo, email, region, avatar } = req.body;
    const newUser = { ...req.body };
    if (!req.file) newUser.avatar = undefined;
    else newUser.avatar = req.file.path;
    User.findByIdAndUpdate(req.params.id, newUser)
      .then(() => {
        console.log("NewUser", newUser);
        // res.redirect("/api/auth/isLoggedIn");
        res.status(200).json(newUser);
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
