const mongoose = require('mongoose');

const Schema = mongoose.Schema

const webPostSchema = new Schema({
    title:String,
    body: String,
    author:String,
    publishedDate: [Date],
    editedDate:[Date]
})

const webPost = mongoose.model("webPost",webPostSchema)

module.exports = webPost
