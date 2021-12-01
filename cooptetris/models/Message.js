const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  senderSocketId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  time: { 
  	type: Date, 
  	default: Date.now 
  }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;