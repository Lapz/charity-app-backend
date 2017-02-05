const express = require('express');
    router = express.Router()


const Image = require('./models/images.js')
router.use((req,res,next)=>{
        console.log('Something is happening')
        next()
    })
    router.get('/imgs', (req,res)=>{

    })

    router.route('imgs')
        .get((req,res)=>{

        })
        .put((req,res)=>{

        })

        .delete((req,res)=>{

        })

module.exports = router