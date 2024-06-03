const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
  content: {
    type: String,
    required: false
  },
  whatched: {
    type: Boolean,
    required: false,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  sender: {
    type: String,
    required: false
  }
})

const MessagesSchema = mongoose.Schema({
  usuarioId: {
      type: String,
      required: true 
  },
  messages: {
    type: [MessageSchema],
    required: false,
    default: []
  }
}); 



module.exports = mongoose.model('Messages', MessagesSchema);