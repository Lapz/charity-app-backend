const jwt = require("jsonwebtoken");

const account = require("../models/account.js");
const secret = "blue"
const PassportLocalStrategy = require("passport-local").Strategy;

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

    return account.findOne({
        username: userData.username
    }, (err, user) => {
        if (err) {
            return done(err)
        }

        if (!user) {
            const error = new Error("Incorrect email or passowrd")

            error.name = "IncorrectCredentialsError";

            return done(error)
        }

        return account.comparePassword(userData.password, (passwordErr, isMatch) => {
            if (err) {
                return done(err);
            }

            if (!isMatch) {
                const error = new Error('Incorrect email or password');
                error.name = 'IncorrectCredentialsError';

                return done(error);
            }

            const payload = {
                sub: user._id
            };

            // create a token string
            const token = jwt.sign(payload, secret)
            const data = {
                name: user.username
            };

            return done(null, token, data);
        })
    })
})