const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  pseudo: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: String,   
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  region: {
    type: String,
    enum: ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unys", "Kalos", "Alola", "Galar"],
    //default: "Kanto",
  },
  pokeFav: [{
      type: Schema.Types.ObjectId,
      ref: "pokemons",
    }],
  pokeTeam: [{
      type: Schema.Types.ObjectId,
      ref: "pokemons",
    }]
});

const User = mongoose.model("User", userSchema);
module.exports = User;
