const WebPost = require('../models/webPost.js');

const express = require('express');

const router = express.Router();

const Account = require('../models/account');

const Post = new WebPost();

router.get('/', (req, res) => {
  res.json({ message: 'horray! welcome to our api' });
});

router
  .route('/posts')
  .post((req, res) => {
    const NewPost = new WebPost({ title: req.body.title, body: req.body.textBody });
    NewPost.save((err) => {
      if (err) {
        res.send(err);
      } else {
        res.json({ message: 'Post created' });
      }
    });
  })
  .get((req, res) => {
    WebPost.find((err, posts) => {
      if (err) {
        res.send(err);
      }

      res.json(posts);
    });
  });

router
  .route('/posts/:post_id')
  .get((req, res) => {
    WebPost.findById(req.params.post_id, (err, post) => {
      if (err) {
        res.send(err);
      }
      res.json(post);
    });
  })
  .put((req, res) => {
    WebPost.findById(req.params.post_id, (err, post) => {
      if (err) {
        res.send(err);
      }

      post.title = req.body.title; // updates the title

      post.body = req.body.textBody;

      post.save((err) => {
        if (err) {
          res.send(err);
        }

        res.json({ message: 'Post Updated' });
      });
    });
  })
  .delete((req, res) => {
    WebPost.remove({
      _id: req.params.post_id,
    }, (err, post) => {
      if (err) {
        res.send(err);
      }

      res.json({ message: 'post deleted' });
    });
  });

module.exports = router;
