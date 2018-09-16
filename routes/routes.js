const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts-controller');

/* GET Posts from Mongo Database */
router.get('/getPosts', postController.getPosts);

/* DELETE post from Mongo Database */
router.delete('/deletePost/:id', postController.deletePost);

module.exports = router;