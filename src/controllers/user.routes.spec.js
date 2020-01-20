const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const User = require('../models/user.model')


describe('user endpoints', function() {
  describe('integration tests', function() {
    it('(POST /api/user) should create a new user', async function() {
      const username = 'Joe'
      const password = 'Secret123$'

      const res = await requester.post('/api/users').send({
        username: username,
        password: password
      })
      expect(res).to.have.status(200)

      const user = await User.findOne({
        username: username
      })
      expect(user).to.have.property('threads').and.to.be.empty
    })

    it('(POST /api/user) should not create a user without a name', async function() {
      const res = await requester.post('/api/users').send({
        garbage: 'some text'
      })

      expect(res).to.have.status(500)

      const docCount = await User.find().countDocuments()
      expect(docCount).to.equal(0)
    })

    it('(PUT /api/user) should change password when credentials are correct', async function() {
      const username = 'Alex'
      const password = 'Secret123$'
      const newPassword = 'Geheim123$'
      await new User({
        username: username,
        password: password
      }).save()

      const res = await requester.put('/api/users').send({
        username: username,
        password: password,
        newPassword: newPassword
      })

      expect(res).to.have.status(200)
      const user = await User.findOne({
        username: username
      })
      expect(user).to.have.property('password', newPassword)
    })

    it('(PUT /api/user) should not change password when credentials are invalid', async function() {
      const username = 'Alex'
      const password = 'Secret123$'
      const newPassword = 'Geheim123$'
      await new User({
        username: username,
        password: password
      }).save()

      const res = await requester.put('/api/users').send({
        username: username,
        password: 'wrongPassword',
        newPassword: newPassword
      })

      expect(res).to.have.status(401)
      const user = await User.findOne({
        username: username
      })
      expect(user).to.have.property('password', password)
    })

    it('(DELETE /api/user) should not deactivate user when credentials are invalid', async function() {
      const username = 'Alex'
      const password = 'Secret123$'
      await new User({
        username: username,
        password: password
      }).save()

      const res = await requester.delete('/api/users').send({
        username: username,
        password: 'wrongPassword'
      })

      expect(res).to.have.status(401)
      const user = await User.findOne({
        username: username
      })
      expect(user).to.have.property('username', username)
      expect(user).to.have.property('password', password)
      expect(user).to.have.property('active', true)
    })

    it('(DELETE /api/user) should deactivate user when credentials are valid', async function() {
      const username = 'Alex'
      const password = 'Secret123$'
      await new User({
        username: username,
        password: password
      }).save()

      const res = await requester.delete('/api/users').send({
        username: username,
        password: password
      })

      expect(res).to.have.status(200)
      const user = await User.findOne({
        username: username
      })
      expect(user).to.have.property('username', username)
      expect(user).to.have.property('password', password)
      expect(user).to.have.property('active', false)
    })
  })
});
