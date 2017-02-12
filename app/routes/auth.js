const Account = require("../models/account");

const passport = require('passport');

const express = require('express');

const app = express()
const jwt = require("jwt-simple")

const router = express.Router()

const User = new Account()

router
    .route("/users")
    .get((req, res) => {
        Account.find((err, users) => {
            if (err) 
                res.send(err)

            res.json(users)
        })
    })

router
    .route("/signup")
    .post((req, res) => {
        if (!req.body.username || !req.body.password) {
            res.json({sucess: false, msg: "Enter a password or email"})
        } else {
            const newUser = new Account({username: req.body.username, password: req.body.password})

            newUser.save((err) => {
                if (err) {
                    return res.json({success: false, msg: "Username already exists"})
                }

                res.json({success: true, msg: "New user made"})
            })
        }

    })

router
    .route("/authenticate")
    .post((req, res) => {
        Account.findOne({
            username: req.body.username
        }, (err, user) => {
            if (err) 
                res.send(err)

            if (!user) {
                res.send({success: false, msg: "authentication faild. User not found"})
            } else {
                console.log(req.body.password)
                user.comparePassword(req.body.password, (err, isMatch) => {
                    if (isMatch && !err) {
                        const token = jwt.encode(user, process.env.JWT_SECRET)

                        res.json({
                            success: true,
                            token: "JWT " + token
                        })
                    } else {
                        res.send({success: false, msg: 'Authentication failed. Wrong password.'})
                    }
                })
            }
        })

        // res.send({message: "Logged in", success: true, token})
    })

router
    .route("/logout")
    .get((req, res) => {
        req.logout()
        res.json({message: "Logged out"})
    })
module.exports = router