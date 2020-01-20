const express = require('express')
const app = express()

// parse body of incoming request
const bodyParser = require('body-parser')
app.use(bodyParser.json())


app.use(bodyParser.json());
const userRoutes = require('./src/controllers/user_routes');
const threadRoutes = require('./src/controllers/thread_routes');
const commentRoutes = require('./src/controllers/comment_routes');
const friendRoutes = require('./src/controllers/friend_routes');

app.use('/api/users', userRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/friends', friendRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            Message: error.message
        }
    })
});

module.exports = app;
