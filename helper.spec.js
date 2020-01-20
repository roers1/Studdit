const mongoose = require('mongoose')

// open a connection to the test database (don't use production database!)
before(function(done) {
  mongoose.connect('mongodb://localhost:27017/studdit_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => done())
    .catch(err => done(err))
})

// drop both collections before each test
beforeEach((done) => {
  const {
    users,
    threads,
    comments
  } = mongoose.connection.collections;

  users.drop(() => {
    threads.drop(() => {
      comments.drop(() => {
        done();
      })
    })
  })
});
