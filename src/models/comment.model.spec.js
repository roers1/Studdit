const expect = require('chai').expect
const mongoose = require('mongoose')

const User = require('./user.model')
const Thread = require('./thread.model')
const Comment = require('./comment.model')

describe('comment model', function() {

    const username = 'Joe'
    const title = 'Good title'
    const content = 'Good content'
    const text = 'text'
    var thread
    var user

    beforeEach(async function() {
      user = new User({
        username: username,
        password: 'Secret123$'
      })

      user = await user.save()

      thread = new Thread({
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

    it('Should create a comment to a thread', async ()=>{
        var comment = new Comment({
            text: text,
            thread: mongoose.Types.ObjectId(thread._id),
            owner: mongoose.Types.ObjectId(user._id)
        })
    
        await comment.save()
        .then(async (result) => {
            await Thread.updateOne(
            { _id: mongoose.Types.ObjectId(thread.id)}, 
                { 
                    $push: 
                    { 
                        comments: mongoose.Types.ObjectId(result._id)
                    }
                }
            )
        })

        const updatedUser = await User.findOne({username: username})
        const updatedThread = await Thread.findById(updatedUser.threads[0])
        comment = await Comment.findById(updatedThread.comments[0])
        expect(comment).to.have.property('text', text)
    })

    it('Should delete a comment from a thread', async ()=>{
        var comment = new Comment({
            text: text,
            thread: mongoose.Types.ObjectId(thread._id),
            owner: mongoose.Types.ObjectId(user._id)
        })
    
        await comment.save()
        .then(async (result) => {
            await Thread.updateOne(
            { _id: mongoose.Types.ObjectId(thread.id)}, 
                { 
                    $push: 
                    { 
                        comments: mongoose.Types.ObjectId(result._id)
                    }
                }
            )
        })

        const updatedUser = await User.findOne({username: username})
        var updatedThread = await Thread.findById(updatedUser.threads[0])
        comment = await Comment.findById(updatedThread.comments[0])
        expect(comment).to.have.property('text', text)

        await comment.delete()

        updatedThread = await Thread.findById(updatedUser.threads[0])
        expect(updatedThread.comments).to.have.length(0)
    })

});
