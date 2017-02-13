// Basic Setup ===================================

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieparser = require('cookie-parser');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const checkAuth = require('./middleware/checkAuth');
const morgan = require('morgan');

const app = express();
// MONGOOSE ========
dotenv.config();
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/website');

const Account = require('./models/account');

// Config for middleware

app.use(morgan('dev'));
app.use(cookieparser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(corser.create()) ============== Passport config ============

const opts = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
};

passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
  Account.findOne({
    id: jwtPayload.id,
  }, (err, user) => {
    if (err) {
      return done(err, false);
    }

    if (!user) {
      done(null, false);
    }

    done(null, user);
  });
}));

app.use(passport.initialize());
app.use(passport.session());

//= ============================ Server Setup =============================

const port = process.env.PORT || 3001;

// ROUTES FOR OUR API ============================================ Enables CORS
app.use((req, res, next) => { //
  // res.header('Access-Control-Allow-Credentials', true);   //
  // res.header('Access-Control-Allow-Origin', "*");   //
  // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');   //
  // res.header('Access-Control-Allow-Headers', 'X-Requested-With,   //
  // X-HTTP-Method-Override, Content-Type, Accept');
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override ,Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

const posts = require('./routes/posts.js');
const imgs = require('./routes/imgs.js');
const auth = require('./routes/auth.js');
const test = require('./routes/test.js');

app.use('/api', checkAuth, posts, imgs, test);
app.use('/auth', auth);

// 404: Not found
app.use((req, res, next) => {
  res.json({ ERROR: 'Page not found.' });
});

// 500: Error reporing
app.use((err, req, res, next) => {
  res.json({ ERROR: 'Internal server error.' });
});

app.listen(port);

// .log(`Magic happens on port ${port}`);
