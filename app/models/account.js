const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  admin: Boolean,
});

AccountSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
};

AccountSchema.pre('save', (next) => {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }

        user.password = hash;

        return next();
      });
    });
  } else {
    return next();
  }
});

module.exports = mongoose.model('account', AccountSchema);
