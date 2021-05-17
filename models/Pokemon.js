const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pokeSchema = new Schema({

        name: String,
        types: [String],
        height: Number,
        weight: Number,
        stats: [String],
        base_stat: [String],
        moves: [String],
        image: String

})

const Pokemon = mongoose.model("pokemons", pokeSchema);
module.exports = Pokemon;