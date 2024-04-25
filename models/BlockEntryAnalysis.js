const mongoose = require('mongoose');

// basic Analysis 

const BlockEntrySchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
  },

  currentTurn: {
    type: String,
    required: true,
  },

  currentShape: {
    type: String,
    required: true
  },

  currentPlayerScore: {
    type: Array,
    required: true,
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

  currentSuggestionTaken: {
    type: Number,
    required: true
  },

  matrix: {
    type: Array,
    required: true
  },

  shapeList: {
    type: Array,
    required: true
  }

});

const BlockEntry = mongoose.model('BlockEntry', BlockEntrySchema);

module.exports = BlockEntry;