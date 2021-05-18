const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Pokemon = require("../models/Pokemon");
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const protectRoute = require("../middlewares/protectRoute"); 

router.get("/", (req, res, next) => {
    var interval = {
        limit: 48,
        offset: 0
      }
    P.getPokemonsList(interval)
    .then((pokemon) => {
        const arr = pokemon.results.map(p => p.url)
        P.resource(arr)
        .then((dbRes) => {
            console.log(dbRes)
            res.status(200).json(dbRes);
        })
    })
    .catch((err) => {
        next(err)
    })
})

router.get("/:id", (req, res, next) => {
    P.getPokemonByName(req.params.id)
    .then((pokemon) => {
        res.status(200).json(pokemon);
    })
    .catch((err) => {
        next(err)
    })
})

router.post("/createFav", protectRoute, (req, res, next) => {
    // req.body.types = req.body.types.split(",");
    // req.body.stats = req.body.stats.split(",");
    // req.body.base_stat = req.body.base_stat.split(",");
    // req.body.moves = req.body.moves.split(",");
    const newPokemon = req.body; 
  
    console.log("reqbody", newPokemon)
    Pokemon.create(newPokemon)
    .then((dbRes)=>{
        console.log("dbresid", dbRes._id)
        console.log("req session" ,req.session)
        const pokeId = dbRes._id
        User.findOneAndUpdate({ _id: req.session.currentUser }, { $push: {pokeFav: pokeId} }, { new: true })
        .then((dbRes2) => {
           console.log("DBRES2", dbRes2);
        //    res.redirect("/users")
        })
        .catch((err) => {
            next(err)
        })
    })
    })

    router.post("/createTeam", protectRoute, (req, res, next) => {
        // req.body.types = req.body.types.split(",");
        // req.body.stats = req.body.stats.split(",");
        // req.body.base_stat = req.body.base_stat.split(",");
        // req.body.moves = req.body.moves.split(",");
        const newPokemon = req.body; 
      
        console.log("reqbody", newPokemon)
        Pokemon.create(newPokemon)
        .then((dbRes)=>{
            console.log("dbresid", dbRes._id)
            console.log("req session" ,req.session)
            const pokeId = dbRes._id
            User.findOneAndUpdate({ _id: req.session.currentUser }, { $push: {pokeTeam: pokeId} }, { new: true })
            .then((dbRes2) => {
               console.log("DBRES2", dbRes2);
            //    res.redirect("/users")
            })
            .catch((err) => {
                next(err)
            })
        })
        })

module.exports = router;