const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    _id: String,
    title: String,
    created_at: String,
    author: String,
    url: String
});

module.exports = mongoose.model('Post', postSchema);