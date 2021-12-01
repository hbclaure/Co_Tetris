const mongoose = require('mongoose');

const TurnEntrySchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
  },
  currentTurn: {
    type: String,
    required: true,
  },
  players: {
    type: Array,
    required: true,
  },
  turnCount: {
    type: Number,
    required: true,
  },
  resetCount: {
    type: Number,
    required: true
  },
  time: {
    type: Number,
    required: true
  }

});

const TurnEntry = mongoose.model('TurnEntry', TurnEntrySchema);

module.exports = TurnEntry;