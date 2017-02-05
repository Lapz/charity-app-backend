const express = require('express');
    router = express.Router()


const Image = require('../models/image.js')

router.use((req,res,next)=>{
    console.log('Something is happening')
    next()
})

router.route('/imgs')
    .get((req,res)=>{
        Image.find((err, image)=>{
            if(err)
                res.send(err)
            res.send(image)
        })
    })

    .put((req,res)=>{
        Image.save((err,image)=>{
            if(err)
                res.send(err)
        })
    })

    .delete((req,res)=>{

    })

module.exports = router