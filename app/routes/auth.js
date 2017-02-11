const Account = require("../models/account");

const passport = require('passport');

const express = require('express');

const app = express()

// app.set('superSecret', config.secret)
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

        Account.register(new Account({username: req.body.username, admin: "true"}), req.body.password, (err, account) => {
            if (err) 
                res.json({info: "That username exists already. Try again"})

            passport.authenticate('local')(req, res, () => {
                res.json({sucess: true, message: "Account Created"})
            })
        })
    })

router
    .route("/authenticate")
    .post(passport.authenticate('local'), (req, res) => {

        console.log(req.body)

        res.send({message: "Logged in", cookie: req.session})
    })

router
    .route("/logout")
    .get((req, res) => {
        req.logout()
        res.json({message: "Logged out"})
    })
module.exports = router