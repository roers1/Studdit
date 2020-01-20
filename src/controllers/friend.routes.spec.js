const chai = require('chai')
const expect = chai.expect
const neo4j = require('neo4j-driver').v1
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j', 'Wwvstuddit123'))
var session = driver.session();
const requester = require('../../requester.spec')

const User = require('../models/user.model')


describe('friends endpoints', function() {
  describe('integration tests', function() {

    username1 = 'robert'
    username2 = 'robin'

    beforeEach(async function() {
        var user = new User({
          username: username1,
          password: 'Secret123$'
        })
  
        user = await user.save()

        user = new User({
            username: username2,
            password: 'Secret123$'
        })

        user = await user.save()
    })
    
    it('(POST /api/friends) should create a friendship', async function() {

      const res = await requester.post('/api/friends').send({
        username1: username1,
        username2: username2
      })

      expect(res).to.have.status(200)
      expect(res.body).to.have.property('Message', 'Friendship confirmed')
    })

    it('(DELETE /api/friends) should delete a friendship', async function() {
  
        await requester.post('/api/friends').send({
            username1: username1,
            username2: username2
        })

        const res = await requester.delete('/api/friends').send({
          username1: username1,
          username2: username2
        })
  
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('Message', 'Friendship removed')
    })
  })
});
