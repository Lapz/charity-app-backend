// Basic Setup ===================================

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/website');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/website');

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

const port = process.env.PORT || 3001;

// ROUTES FOR OUR API ============================================ Enables CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const router = express.Router();

const posts = require('./routes/posts.js');
const imgs = require('./routes/imgs.js');
// app.use((req,res,next)=>{         console.log('Something is happening')
//   next()     })

app.use('/api', posts, imgs);

// require('./routes/routes.js')(app)

app.listen(port);

console.log('Magic happens on port ' + port);