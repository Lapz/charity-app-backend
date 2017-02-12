// Basic Setup ===================================

require("dotenv").config()
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieparser = require("cookie-parser");
const jwtStrategy = require("passport-jwt").Strategy;
ExtractJwt = require("passport-jwt").ExtractJwt;
const checkAuth = require("./middleware/checkAuth");
const morgan = require("morgan")
// MONGOOSE ========
mongoose.Promise = global.Promise;
console.log(process.env.JWT_SECRET)
mongoose.connect('mongodb://localhost/website');

const Account = require("./models/account");

// Config for middleware
app.use(morgan("dev"))
app.use(cookieparser())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// ============== Passport config ============

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

app.use(passport.initialize());
app.use(passport.session());

//============================= Server Setup =============================

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

// 404: Not found
app.use(function (req, res, next) {
  res
    .status(404)
    .json({ERROR: 'Page not found.'});
});

// 500: Error reporing
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res
    .status(500)
    .json({ERROR: 'Internal server error.'});
});

app.listen(port);

console.log('Magic happens on port ' + port);