const mongoose = require('mongoose');

const TurnEntryASchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
  },
  currentTurn: {
    type: String,
    required: true,
  },
  playerRowScore: {
    type: Array,
    required: true,
  }, 
  playerScore: {
    type: Array,
    required: true,
  }, 
  playerTurns: {
    type: Array,
    required: true
  },
  turnCount: {
    type: Number,
    required: true,
  },
  resetCount: {
    type: Number,
    required: true
  },
  left: {
    type: Array,
    required: true
  },
  rotate: {
    type: Array,
    required: true
  },
  right: {
    type: Array,
    required: true
  },
  down: {
    type: Array,
    required: true
  },
  bottom: {
    type: Array,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  suggestionTaken: {
    type: Number,
    required: true
  },
  shapeList: {
    type: Array,
    required: true
  },
  timeList: {
    type: Array,
    required: true
  },
  matrix: {
    type: Array,
    required: true
  },

  currentShape: {
    type: String,
    required: true 
  }
});

const TurnEntryA = mongoose.model('TurnEntryA', TurnEntryASchema);

module.exports = TurnEntryA;