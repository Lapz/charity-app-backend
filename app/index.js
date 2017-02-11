// Basic Setup ===================================

const express = require('express');

const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/website');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/website');

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

// secret variable

const port = process.env.PORT || 3001;

// ROUTES FOR OUR API ============================================ Enables CORS
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

const router = express.Router();

const posts = require('./routes/posts.js');
const imgs = require('./routes/imgs.js');

const auth = require("./routes/auth.js");
// app.use((req,res,next)=>{         console.log('Something is happening')
// next()     })

app.use('/api', auth, posts, imgs)

app.use((req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {

    // verifies secret and checks exp
    jwt
      .verify(token, app.get('superSecret'), function (err, decoded) {
        if (err) {
          return res.json({success: false, message: 'Failed to authenticate token.'});
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });

  } else {

    // if there is no token return an error
    return res
      .status(403)
      .send({success: false, message: 'No token provided.'});

  }
});

// app.use('/api', posts, imgs); require('./routes/routes.js')(app)

app.listen(port);

console.log('Magic happens on port ' + port);