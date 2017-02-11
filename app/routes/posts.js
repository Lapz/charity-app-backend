// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/website');

const webPost = require('../models/webPost.js');

const passport = require("passport");
const express = require('express');
const router = express.Router();

const Account = require("../models/account");

const Post = new webPost()

router.get('/', (req, res) => {
    res.json({message: 'horray! welcome to our api'})
})

router
    .route('/posts')
    .post((req, res) => {
        const newPost = new webPost({title: req.body.title, body: req.body.textBody})
        newPost.save((err) => {
            if (err) {
                res.send(err)
            } else {
                res.json({message: "Post created"})
            }
        })
    })
    .get((req, res) => {
        webPost.find((err, posts) => {
            if (err) {
                res.send(err)
            }

            res.json(posts)
        })
    })

router
    .route('/posts/:post_id')
    .get((req, res) => {
        webPost.findById(req.params.post_id, (err, post) => {
            if (err) {
                res.send(err)
            }
            res.json(post)
        })
    })
    .put((req, res) => {
        webPost.findById(req.params.post_id, (err, post) => {
            if (err) 
                res.send(err)

            console.log(req.body)

            post.title = req.body.title // updates the title

            post.body = req.body.textBody

            post.save((err) => {
                if (err) 
                    res.send(err)

                res.json({message: "Post Updated"})
            })

        })
    })
    .delete((req, res) => {
        webPost.remove({
            _id: req.params.post_id
        }, (err, post) => {
            if (err) 
                res.send(err)

            res.json({"message": "post deleted"});
        })
    })

module.exports = router