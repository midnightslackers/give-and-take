const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
  username : {
    type: String,
    required: true
  },
  password : {
    type: String,
    required: true
  },
  admin : {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

userSchema.methods.makeHash = function(pw) {
  return this.password = bcrypt.hashSync(pw);
};

userSchema.methods.checkHash = function(pw) {
  return bcrypt.compareSync(pw, this.password);
};

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
