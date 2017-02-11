// Basic Setup ===================================
const mongoose = require('mongoose');
const express = require('express');
const session = require("express-session");
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/website'); MONGOOSE
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/website');

// Config for middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({secret: "Iamsoamazing"}))
app.use(passport.initialize());
app.use(passport.session());

// Passport config
const Account = require("./models/account");

passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// secret variable
const port = process.env.PORT || 3001;
function ensureAuthed(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.json({message: "Not signed in "})
}
// ROUTES FOR OUR API ============================================ Enables CORS
app
  .use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
  });

const posts = require('./routes/posts.js');
const imgs = require('./routes/imgs.js');
const auth = require("./routes/auth.js");

app.use('/api', auth)

app.use("/api", ensureAuthed, posts, imgs)

app.listen(port);

console.log('Magic happens on port ' + port);