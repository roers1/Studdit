const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const User = require('../models/user.model')
const Thread = require('../models/thread.model')
const Comment = require('../models/comment.model')

router.post('/:id', async (req, res, next) => {
  try {
    const user = await User.find({
      username: req.body.username
    })

    var thread = await Thread.findById({
      _id: mongoose.Types.ObjectId(req.params.id)
    })

    if (user === null || thread === null) {
      res.status(400).json({
        Message: 'Username or thread not found'
      })
    } else {
      const comment = new Comment({
        text: req.body.text,
        thread: mongoose.Types.ObjectId(thread._id),
        owner: mongoose.Types.ObjectId(user._id)
      })

      await comment.save()
        .then(async (result) => {
          await Thread.updateOne(
            { _id: mongoose.Types.ObjectId(req.params.id)}, 
            { $push: { comments: mongoose.Types.ObjectId(result._id)}}
          )
          res.status(200).json({
            message: 'Comment created'
          })
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    }
  } catch {
    res.status(204).json({
      Message: 'Bad Id'
    })
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const comment = await Comment.findById(mongoose.Types.ObjectId(req.params.id))
    if(comment === null){
      res.status(404).json({
        Message: 'Comment not found'
      })
    } else {
      await comment.delete()
      res.status(200).json({
        Message: 'Comment deleted'
      })
    }
  } catch {
    res.status(204).json({
      Message: 'Bad Id'
    })
  }
})

module.exports = router;
