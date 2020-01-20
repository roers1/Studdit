const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const neo4j = require('neo4j-driver').v1
const User = require('../models/user.model')

var driver = neo4j.driver('bolt://hobby-jhdgljlbhcddgbkebcpamddl.dbs.graphenedb.com:24787',neo4j.auth.basic('admin', 'b.WQ875qsaKeGw.70ElvGVHQ72WT2SP'))
var session = driver.session();

router.post('/', async (req, res, next) => {

const user1 = await User.findOne({username: req.body.username1})
const user2 = await User.findOne({username: req.body.username2})

  if (user1 === null || user2 === null ) {
    res.status(404).json({
      Message: 'Could not find user1 or user2'
    })
  } else {
      session
      .run(
        `MERGE (a:Person {name: $name1}) 
        MERGE (b:Person {name: $name2})
        MERGE (a)-[:friends]-(b)`,
        {name1: user1.username,
        name2: user2.username})
        .then((result) => {
              res.status(200).json({
                Message: 'Friendship confirmed'
              });
        })
        .catch((err) =>{
            console.log(err.message)
             res.status(204).json({
                Message: err.message
             })
        })
    }
})

router.delete('/', async (req, res, next) => {

    const user1 = await User.findOne({username: req.body.username1})
    const user2 = await User.findOne({username: req.body.username2})
    
      if (user1 === null || user2 === null ) {
        res.status(404).json({
          Message: 'Could not find user1 or user2'
        })
      } else {
          session
          .run(
            `MATCH (a:Person {name: $name1}) 
            MATCH (b:Person {name: $name2})
            MATCH (a)-[c:friends]-(b)
            DELETE c`,
            {name1: user1.username,
            name2: user2.username})
            .then((result) => {
                  res.status(200).json({
                    Message: 'Friendship removed'
                  });
            })
            .catch((err) =>{
                console.log(err.message)
                 res.status(204).json({
                    Message: err.message
                 })
            })
        }
    })

module.exports = router;
