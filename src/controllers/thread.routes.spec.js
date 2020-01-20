const chai = require('chai')
const expect = chai.expect
const mongoose = require('mongoose')
const requester = require('../../requester.spec')

const User = require('../models/user.model')
const Thread = require('../models/thread.model')
const Comment = require('../models/comment.model')

describe('thread endpoints', function() {
  describe('integration tests', function() {
    const username = 'Joe'
    const password = 'Secret123$'
    const title = 'Good title'
    const content = 'Good content'
    const newContent = 'Amazing content'

    beforeEach(async function() {
      const user = new User({
        username: username,
        password: password
      })
      
      await user.save()
    })

    it('(POST /api/threads) should create a new thread', async function() {
      const res = await requester.post('/api/threads').send({
        username: username,
        title: title,
        content: content
      })
      expect(res).to.have.status(200)

      const user = await User.findOne({
        username: username
      })

      const thread = await Thread.findById(user.threads[0])
      expect(thread).to.have.property('title', title)
      expect(thread).to.have.property('content', content)
    })

    it('(GET /api/threads) should get threads', async function() {
      var user = await User.findOne({
        username: username
      })

      var thread = new Thread({
        title: 'thread1',
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

      thread = new Thread({
        title: 'thread2',
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

      const res = await requester.get('/api/threads')

      expect(res.body.thread).to.have.length(2)
    })

    it('(GET /api/threads) should get thread', async function() {
      var user = await User.findOne({
        username: username
      })

      var thread = new Thread({
        title: 'thread1',
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

      const comment = new Comment({
        text: content,
        thread: mongoose.Types.ObjectId(thread._id),
        owner: mongoose.Types.ObjectId(user._id)
      })

      await comment.save()
        .then(async (result) => {
          await Thread.updateOne({ 
            _id: mongoose.Types.ObjectId(thread._id)
          }, { 
            $push: { 
              comments: mongoose.Types.ObjectId(result._id)
            }
          })
        })

      const res = await requester.get(`/api/threads/${thread._id}`)
      expect(res.body.thread).to.not.be.empty
    })

    it('(GET /api/threads) with bad id should not get thread', async function() {
      var user = await User.findOne({
        username: username
      })

      var thread = new Thread({
        title: 'thread1',
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

      const res = await requester.get(`/api/threads/${thread._id}a`)
      expect(res).to.have.status(204)
      expect(res.body).to.be.empty
    })


    it('(PUT /api/threads) should change thread content', async function() {

      await requester.post('/api/threads').send({
        username: username,
        title: title,
        content: content
      })

      const user = await User.findOne({
        username: username
      })

      const thread = await Thread.findById(user.threads[0])

      const res = await requester.put(`/api/threads/${thread._id}`).send({
        content: newContent
      })

      expect(res).to.have.status(200)

      const updatedThread = await Thread.findById(user.threads[0])
      expect(updatedThread).to.have.property('title', title)
      expect(updatedThread).to.have.property('content', newContent)
    })

    it('(PUT /api/threads) with bad Id should not update anything', async function() {
      const newContent = 'Amazing content'

      await requester.post('/api/threads').send({
        username: username,
        title: title,
        content: content
      })

      const user = await User.findOne({
        username: username
      })

      var res = await requester.put(`/api/threads/thread._id`).send({
        content: newContent
      })

      expect(res).to.have.status(204)

      const updatedThread = await Thread.findById(user.threads[0])
      expect(updatedThread).to.have.property('title', title)
      expect(updatedThread).to.have.property('content', content)
    })

    it('(DELETE /api/threads) should delete thread and associated comments', async function() {
      const text = 'This is text for the comment'

      var user = await User.findOne({
        username: username
      })

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

      user = await User.findOne({
        username: username
      })

      thread = await Thread.findById(user.threads[0])

      var comment = new Comment({
        text: text,
        thread: thread._id,
        owner: user._id
      })

      await comment.save()
        .then(async (result) => {
          await Thread.updateOne({
            _id: mongoose.Types.ObjectId(thread._Id)
          }, {
            $push: {
              comments: mongoose.Types.ObjectId(result._id)
            }
          })
        })      

      comment = await Comment.findById(comment._id)
      expect(comment).to.not.be.null

      const res = await requester.delete(`/api/threads/${thread._id}`).send()

      comment = await Comment.findById(comment._id)
      thread = await Thread.findById(thread._id)
      expect(comment).to.be.null
      expect(thread).to.be.null
      expect(res).to.have.status(200)
    })

    it('(DELETE /api/threads) with bad id should not delete thread and associated comments', async function() {
      const text = 'This is text for the comment'

      var user = await User.findOne({
        username: username
      })

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

      user = await User.findOne({
        username: username
      })

      thread = await Thread.findById(user.threads[0])

      var comment = new Comment({
        text: text,
        thread: thread._id,
        owner: user._id
      })

      await comment.save()
        .then(async (result) => {
          await Thread.updateOne({
            _id: mongoose.Types.ObjectId(thread._Id)
          }, {
            $push: {
              comments: mongoose.Types.ObjectId(result._id)
            }
          })
        })      

      comment = await Comment.findById(comment._id)
      expect(comment).to.not.be.null

      var res = await requester.get(`/api/threads/${thread._id}`)
      res = await requester.delete(`/api/threads/thread._id`)

      expect(res).to.have.status(204)
    })
  })
});
