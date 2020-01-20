const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'An user needs to have a username'],
    index: {
      unique: true
    }
  },

  password: {
    type: String,
    required: [true, 'A user needs to have a password']
  },

  active: {
    type: Boolean,
    default: true
  },

  friendlist: [{
    type: Schema.Types.ObjectId,
    required: [false, 'A user can have 0 friends'],
    ref: 'user',
    default: []
  }],

  threads: [{
    type: Schema.Types.ObjectId,
    ref: 'thread',
    default: []
  }]

});

UserSchema.plugin(uniqueValidator);

const User = mongoose.model('user', UserSchema);

module.exports = User;
