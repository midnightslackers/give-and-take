const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
  },
  fullName : {
    type: String
  },
  gender : {
    type: String,
    enum: ['male', 'female']
  },
  ratio : {
    type: Number,
    default: 0
  },
  skills: {
    type: Schema.Types.ObjectId,
    ref: 'Topic'
  }
}, {
  timestamps: true
});

userSchema.methods.makeHash = (pw) => {
  return this.password = bcrypt.hashSync(pw);
};

userSchema.methods.checkHash = (pw) => {
  return bcrypt.compareSync(pw, this.password);
};

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
