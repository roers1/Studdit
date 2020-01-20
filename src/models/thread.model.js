const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
  title: {
    type: String,
    required: [true, 'A thread needs to have a title']
  },

  content: {
    type: String,
    required: [true, 'A thread needs to have content']
  },

  owner: {
    type: Schema.Types.ObjectId,
    required: [true, 'A Thread needs to have a owner'],
    ref: 'user'
  },

  upvoters: [{
    type: Schema.Types.ObjectId,
    default: [],
    ref: 'user'
  }],

  downvoters: [{
    type: Schema.Types.ObjectId,
    default: [],
    ref: 'user'
  }],

  votecount: {
    type: Number,
    default: 0
  },

  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'comment',
    default: []
  }],
});

ThreadSchema.pre('remove', function(next) {
  const Comment = mongoose.model('comment');

  Comment.deleteMany({thread: this.id})
    .then(() => next());
});

ThreadSchema.plugin(uniqueValidator);

const Thread = mongoose.model('thread', ThreadSchema);

module.exports = Thread;
