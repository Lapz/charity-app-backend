const account = require("../models/account.js");

const PassportLocalStrategy = require('passport-local').Strategy;

module.exports = new PassportLocalStrategy({
    usernameField: "username",
    passwordField: 'password',
    adminField: "admin",
    session: false,
    passReqToCallback: true
}, (req, username, password, admin, done) => {
    const userData = {
        username: username.trim(),
        password: password.trim(),
        admin: admin
    }

    const newAccount = new account(userData)

    newAccount.save((err) => {
        if (err) {
            res.send(err)

            return done(err)
        }

        return done(null)
    })
})