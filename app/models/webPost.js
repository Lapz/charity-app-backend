const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const webPostSchema = new Schema({
  title: String,
  body: Object,
  author: String,
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  editedDate: Date,
});

const webPost = mongoose.model('webPost', webPostSchema);

module.exports = webPost;
