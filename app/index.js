// Basic Setup

// ===================================

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

// const mongoose = require('mongoose');

//  mongoose.connect('mongodb://localhost/website');

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

// ROUTES FOR OUR API
// ============================================
const router = express.Router();

router.get('/', (req,res)=>{
    res.json({
        message:"request hit",

    })
})


app.use('/api', router);

app.listen(port);

console.log('Magic happens on port ' + port); 