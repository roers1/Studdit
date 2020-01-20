const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const User = require('../models/user.model')
const Thread = require('../models/thread.model')
const Comment = require('../models/comment.model')

const mongoose = require('mongoose')


describe('comment endpoints', function() {
  describe('integration tests', function() {
    const username = 'Joe'
    const title = 'Good title'
    const content = 'Good content'

    beforeEach(async function() {
      var user = new User({
        username: username,
        password: 'Secret123$'
      })

      user = await user.save()

      var thread = new Thread({
        title: title,
        content: content,
        owner: mongoose.Types.ObjectId(user._id)
      })

      thread = await thread.save()

      await User.updateOne({
        username: username
      }, {
        $push: {
          threads: thread._id
        }
      })
    })

    it('(POST /api/comments) should create a comment to the thread', async function() {
      const text = 'This is text for the comment'

      const user = await User.findOne({
        username: username
      })

      const thread = await Thread.findById(user.threads[0])

      const res = await requester.post(`/api/comments/${thread._id}`).send({
        text: text,
        username: username
      })

      expect(res).to.have.status(200)

      const updatedThread = await Thread.findById(user.threads[0])
      const comment = await Comment.findById(updatedThread.comments[0])
      expect(comment).to.have.property('text', text)
    })

    it('(POST /api/comments) should not create a comment with invalid threadId', async function() {
      const text = 'This is text for the comment'

      const user = await User.findOne({
        username: username
      })

      const thread = await Thread.findById(user.threads[0])


      const res = await requester.post(`/api/comments/thread._id`).send({
        text: text,
        username: username
      })

      expect(res).to.have.status(204)
    })

    it('(DELETE /api/comments) should delete a comment', async function() {
      const text = 'This is text for the comment'

      const user = await User.findOne({
        username: username
      })

      const thread = await Thread.findById(user.threads[0])

      var comment = new Comment({
        text: text,
        thread: thread._id,
        owner: user._id
      })

      comment = await comment.save()

      const res = await requester.delete(`/api/comments/${comment._id}`).send()        

      expect(res).to.have.status(200)
      expect(res.body).to.have.property('Message', 'Comment deleted')
    })

    it('(DELETE /api/comments) with bad id should not delete a comment', async function() {
      const text = 'This is text for the comment'

      const user = await User.findOne({
        username: username
      })

      const thread = await Thread.findById(user.threads[0])

      var comment = new Comment({
        text: text,
        thread: thread._id,
        owner: user._id
      })

      comment = await comment.save()

      const res = await requester.delete(`/api/comments/comment._id`).send()

      expect(res).to.have.status(204)
    })
  })
});
