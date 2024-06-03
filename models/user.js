const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  usuario: {
      type: String,
      required: true 
  },
  correo: {
      type: String,
      required: true 
  },
  pass: {
      type: String,
      required: true
  },
  rol: {
      type: String,
      required: true
  },
  resetPasswordExpires: {
    type : String,
    required: false,
    default: undefined
  },
  resetPasswordToken: {
    type: String,
    required: false,
    default: undefined
  }
}); 

module.exports = mongoose.model('User', UserSchema);