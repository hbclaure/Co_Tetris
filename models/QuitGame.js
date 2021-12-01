const mongoose = require('mongoose');

const QuitGameSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
  },
  quitPlayer: {
    type: String,
    required: true,
  },

  quitTime: {
  	type: String,
  	required: true
  },

  currentPlayer: {
  	type: String,
  	required: true
  }
  
});

const QuitGame = mongoose.model('QuitGame', QuitGameSchema);

module.exports = QuitGame;