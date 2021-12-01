const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
  },
  players: {
    type: Array,
    required: true,
  },

  is_AI: {
  	type: String,
  	required: true,
  },
  turns: { 
    type: Array,
    requird: true,
  }
  
});

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;