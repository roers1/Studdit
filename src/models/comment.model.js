const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: {
    type: String,
    required: [true, 'A comment needs text']
  },

  owner: {
    type: Schema.Types.ObjectId,
    required: [true, 'A comment needs an owner'],
    ref: 'user'
  },

  thread: {
    type: Schema.Types.ObjectId,
    required: [true, 'A comment needs a thread'],
    ref: 'thread'
  },

  comments: {
    type: [Schema.Types.ObjectId],
    ref: 'comment'
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
    type: Number
  },
});

CommentSchema.pre('remove', async function(next) {
  const Thread = mongoose.model('thread');

  await Thread.updateOne({_id: mongoose.Types.ObjectId(this.thread)}, {
    $pull:{
      "comments": this._id
    }
  })

});

CommentSchema.plugin(uniqueValidator);

const comment = mongoose.model('comment', CommentSchema);

module.exports = comment;
