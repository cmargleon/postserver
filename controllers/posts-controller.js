const axios = require('axios');
const Post = require('../models/post');

const apiUrl = 'https://hn.algolia.com/api/v1/search_by_date?query=nodejs';

function filterAndSort (posts) {
  //FILTER NULL URL
  const filteredByUrl = posts.filter(post => {
    let allowed = false;
    if (post.url || post.story_url) {
      allowed = true;
    }
    return allowed;
  });
  //FILTER NULL TITLES
  const filterNullTitles = filteredByUrl.filter(post => {
    let allowed = false;
    if (post.title || post.story_title) {
      allowed = true;
    }
    return allowed;
  });
  //SORT POSTS BY DATE
  const filteredAndSorted = filterNullTitles.sort((a, b) => {
    return +new Date(b.created_at) - +new Date(a.created_at);
  });
  return filteredAndSorted;
}

exports.everyHour = async (req, res, next) => {
    try {
        data = await axios.get(apiUrl);
        const posts = data.data.hits;
        const filteredAndSorted = filterAndSort(posts);
        newPosts = [];
        for (let post of filteredAndSorted) {
          const saveDocs = await Post.countDocuments({_id: post.objectID});
          if (saveDocs > 0) {
            //console.log("Post already exists");
          } else {
            let obj = {
              _id: post.objectID,
              title: post.title || post.story_title,
              author: post.author,
              url: post.url || post.story_url,
              created_at: post.created_at
            };
            newPosts.push(obj);
          };
        };
        console.log(filteredAndSorted.length);
        console.log(newPosts);
        const inserted = await Post.insertMany(newPosts);
        const reps = [
          "There are no new posts to save",
          "One new post saved",
          inserted.length + " new saved posts"
        ];
        const respond = inserted.length<1 ? reps[0] : (inserted.length==1 ? reps[1] : reps[2]);
        console.log(respond);
        return;
      } catch (error) {
        console.log(error);
      }
},

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    //console.log(posts);
    for (let post of posts) {
      console.log(post._id);
    }
    console.log(posts)
    return res.status(200).send(posts)
  } catch(error) {
    console.log(error);
  }
},

exports.deletePost = async (req, res, next) => {
  try {
    const deletedPost = await Post.deleteOne({ '_id': req.params.id });
    console.log(deletedPost.n);
    if (deletedPost.n == 0) {
      return res.status(500).json({
        message: "Something went wrong"
      })
    }
    return res.status(200).json({
      message: "success"
    })
    
  } catch(error) {
    console.log(error);
  }
}