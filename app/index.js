// Basic Setup ===================================

require("dotenv").config()
const mongoose = require('mongoose');
const express = require('express');
const session = require("express-session");
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieparser = require("cookie-parser");
const jwtStrategy = require("passport-jwt").Strategy;
ExtractJwt = require("passport-jwt").ExtractJwt;
const checkAuth = require("./middleware/checkAuth")

// MONGOOSE ========
mongoose.Promise = global.Promise;
console.log(process.env.JWT_SECRET)
mongoose.connect('mongodb://localhost/website');

const Account = require("./models/account");

// Config for middleware

app.use(cookieparser())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Passport config
const localsignin = require("./passport/local-signin");
const localsignup = require("./passport/local-signup");

const opts = {}

opts.secretOrKey = process.env.JWT_SECRET;
opts.jwtFromRequest = ExtractJwt.fromAuthHeader()
passport.use(new jwtStrategy(opts, (jwtPayload, done) => {
  Account.findOne({
    id: jwt_payload.id
  }, (err, user) => {
    if (err) {
      return done(err, false)
    }

    if (!user) {
      done(null, false)
    }

    done(null, user)
  })
}))

//=============================

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 3001;

// ROUTES FOR OUR API ============================================ Enables CORS

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

const posts = require('./routes/posts.js');
const imgs = require('./routes/imgs.js');
const auth = require("./routes/auth.js");
app.use("/api", checkAuth, posts, imgs)
app.use('/auth', auth)

app.listen(port);

console.log('Magic happens on port ' + port);

"ASDFSAfsda"