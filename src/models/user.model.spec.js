const expect = require('chai').expect

const User = require('./user.model')

describe('user model', function() {
  it('should reject a missing username', function() {
    const user = new User({
      password: 'Secret123$'
    })

    expect(async () => {
      user.save()
    }).to.throw
  })

  it('should reject a missing password', function() {
    const user = new User({
      username: 'Alex'
    })

    expect(async () => {
      user.save()
    }).to.throw
  })

  it('should create an empty friendlist by default', async function() {
    const user = await new User({
      username: 'Alex',
      password: 'password'
    }).save()

    expect(user).to.have.property('friendlist').and.to.be.empty
  })
})
