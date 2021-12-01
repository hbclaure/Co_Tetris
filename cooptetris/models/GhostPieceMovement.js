const mongoose = require('mongoose');

const GhostMovementSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true
  },
  ghostLeft: {
    type: Array,
    required: true
  },
  ghostRotate: {
    type: Array,
    required: true
  },
  ghostRight: {
    type: Array,
    required: true
  },
  ghostDown: {
    type: Array,
    required: true
  },
  ghostBottom: {
    type: Array,
    required: true
  }, 
  turnCount: {
    type: Number,
    required: true
  }, 

  ghostPlayer: {
    type: String, 
    required: true
  }, 
  playerTurns: {
    type: Array, 
    required: true
  }

});

const GhostMovement= mongoose.model('GhostMovement', GhostMovementSchema);

module.exports = GhostMovement;