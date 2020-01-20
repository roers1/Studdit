const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const User = require('../models/user.model')
const Comment = require('../models/comment.model')

router.post('/', (req, res, next) => {
  const user = new User(req.body)

  user.save()
    .then(result => {
      res.status(200).json({
        Id: user._id
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err.message
      });
    });
})

router.put('/', (req, res, next) => {
  User.findOne({
      username: req.body.username,
      password: req.body.password
    })
    .then((user) => {
      if (user === null) {
        res.status(401).json({
          message: 'Invalid credentials'
        })
      } else {
        user.updateOne({
            password: req.body.newPassword
          })
          .exec()
          .then(() => {
            res.status(200).json({
              message: 'Password succesfully changed'
            });
          })
          .catch(err => {
            res.status(500).json({
              error: err.message
            });
          });
      }
    });
})

router.delete('/', (req, res, next) => {
  User.findOne({
      username: req.body.username,
      password: req.body.password
    })
    .then((user) => {
      if (user === null) {
        res.status(401).json({
          message: 'Invalid credentials'
        })
      } else {
        user.updateOne({
            active: false
          })
          .exec()
          .then(result => {
            res.status(200).json({
              message: 'Account succesfully deactivated'
            });
          })
          .catch(err => {
            res.status(500).json({
              error: err.message
            });
          });
      }
    });
})
module.exports = router;
