const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const User = require('../models/user.model')
const Thread = require('../models/thread.model')

router.post('/', async (req, res, next) => {
  const user = await User.find({
    username: req.body.username
  })

  if (user === null) {
    res.status(400).json({
      Message: 'Invalid username'
    })
  } else {

    const thread = new Thread({
      title: req.body.title,
      content: req.body.content,
      owner: mongoose.Types.ObjectId(user._id)
    })
    await thread.save()
      .then(async (result) => {
        await User.updateOne({
          username: req.body.username
        }, {
          $push: {
            threads: mongoose.Types.ObjectId(result._id)
          }
        })
        res.status(200).json({
          message: 'Thread created',
          id: thread._id
        })
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  }
})

router.put('/:id', async (req, res, next) => {

  try {
    await Thread.findById({
        _id: mongoose.Types.ObjectId(req.params.id)
      })
      .then((thread) => {
        if (thread === null) {
          res.status(400).json({
            Message: 'Thread not found'
          })
        } else {
          thread.updateOne({
              content: req.body.content
            })
            .exec()
            .then(() => {
              res.status(200).json({
                Message: 'Thread succesfully changed'
              });
            })
            .catch(err => {
              res.status(500).json({
                Error: err.message
              });
            });
        }
      })
  } catch {
    res.status(204).json({
        Message: 'Bad Id'
    })
  }
})

router.delete('/:id', async (req, res, next) => {

  try {
    await Thread.findById({_id: mongoose.Types.ObjectId(req.params.id)})
      .then(async (thread) => {
        if (thread === null) {
          res.status(400).json({
            Message: 'Thread not found'
          })
        } else {
          await thread.delete()
          res.status(200).json({
            Message: 'Thread deleted'
          })
        }
      })
  } catch {
    res.status(204).json({
        Message: 'Bad Id' 
    })
  }
})

router.get('/', async (req, res, next) => {
  try {
    await Thread.find({}, '_id title content owner upvoters downvoters')
      .then(async (thread) => {
        if (thread === null) {
          res.status(400).json({
            Message: 'No threads found'
          })
        } else {
          res.status(200).json({
            Message: 'Threads succesfully received',
            thread
          })
        }
      })
  } catch {
    res.status(204).json({
        Message: 'Bad Id' 
    })
  }

  router.get('/:id', async (req, res, next) => {
    try {
      await Thread.findById({_id: mongoose.Types.ObjectId(req.params.id)}, '_id title content owner upvoters downvoters comments')
      .populate('comments')
        .then(async (thread) => {
          if (thread === null) {
            res.status(400).json({
              Message: 'No threads found'
            })
          } else {
            res.status(200).json({
              Message: 'Thread succesfully received',
              thread
            })
          }
        })
    } catch {
      res.status(204).json({
          Message: 'Bad Id' 
      })
    }
  })
})

module.exports = router;
