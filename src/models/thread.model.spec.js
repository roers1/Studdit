const expect = require('chai').expect

const User = require('./user.model')
const Thread = require('./thread.model')

describe('thread model', function() {

  let savedUser
  this.beforeEach(async function() {
    user = {
      username: 'Alex',
      password: 'Secret123$'
    };

    savedUser = await new User(user).save();
    user['id'] = savedUser._id;
  });

  it('Should have property owner when created', async function() {
    thread = {
      title: 'Good title',
      content: 'Average content',
      owner: savedUser._id
    };

    const savedThread = await new Thread(thread).save();

    expect(savedThread).to.have.property('owner', savedUser._id)
  });
});
