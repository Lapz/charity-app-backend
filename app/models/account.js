const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const AccountSchema = new Schema({username: String, password: String, admin: Boolean})

AccountSchema.plugin(passportLocalMongoose)

const account = mongoose.model("account", AccountSchema)

module.exports = account
