const user = require("../models/user");
const jwt = require('jsonwebtoken');
const express = require('express');
const config = require('../config')
const app = express()

app.set('superSecret', config.secret)
const router = express.Router()

const User = new user()

router.use((req, res, next) => {
    console.log("Something is happpening")
    next()
})

router
    .route("/users")
    .get((req, res) => {
        user.find((err, users) => {
            if (err) 
                res.send(err)

            res.json(users)
        })
    })

router
    .route("/setup")
    .post((req, res) => {
        const admin = new user({userName: "admin", password: "admin", admin: "true"});

        admin.save((err) => {
            if (err) 
                res.send(err)

            res.json({message: "User made", success: true})
        })
    })

router
    .route("/authenticate")
    .post((req, res) => {

        console.log(req.body)
        user.findOne({
            userName: req.body.userName
        }, (err, user) => {
            if (err) 
                res.send(err)

            if (!user) {
                res.json({success: false, message: 'Authentication failed. User not found.'});
            } else if (user) {
                if (user.password != req.body.password) {
                    res.json({success: false, message: 'Authentication failed. Wrong password.'})
                } else {
                    const token = jwt.sign(user, app.get('superSecret'), {
                        expiresIn: 1440 // expires in 24 hours
                    });

                    res.json({success: true, message: 'Enjoy your token!', token: token});
                }
            }

        })
    })

module.exports = router