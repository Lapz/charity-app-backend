// Basic Setup ===================================
const mongoose = require('mongoose');
const express = require('express');
const session = require("express-session");
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieparser = require("cookie-parser");
const methodOverride = require("method-override");
const LocalStrategy = require('passport-local').Strategy;
const RedisStore = require("connect-redis")(session);
const config = require("./config");
// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/website'); MONGOOSE
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/website');

// Config for middleware
app.use(methodOverride());
app.use(cookieparser())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
  secret: "Iamsoamazing",
  saveUninitialized: false,
  resave: false,
  store: new RedisStore({url: config.redisStore.url})
}))

// Passport config
const Account = require("./models/account");
app.use(passport.initialize());
app.use(passport.session());
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
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });
// app.use(function (req, res, next) {
// res.header('Access-Control-Allow-Credentials', true);
// res.header('Access-Control-Allow-Origin', req.headers.origin);
// res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
// res.header('Access-Control-Allow-Headers', 'X-Requested-With,
// X-HTTP-Method-Override, Content-Type, Accept');   if ('OPTIONS' ==
// req.method) {     res.send(200);   } else {     next();   } }); app
// .use(function (req, res, next) { res.setHeader('Access-Control-Allow-Origin',
// '*'); res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT
// ,DELETE'); res.setHeader('Access-Control-Allow-Headers',
// 'X-Requested-With,content-type, Authorization');     next();   });

const posts = require('./routes/posts.js');
const imgs = require('./routes/imgs.js');
const auth = require("./routes/auth.js");

app.use('/api', auth)

app.use("/api", ensureAuthed, posts, imgs)

app.listen(port);

console.log('Magic happens on port ' + port);