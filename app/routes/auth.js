const Account = require('../models/account');

const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router
  .route('/users')
  .get((req, res) => {
    Account.find((err, users) => {
      if (err) {
        res.send(err);
      }

      res.json(users);
    });
  });

router
  .route('/signup')
  .post((req, res) => {
    if (!req.body.username || !req.body.password) {
      res.json({ sucess: false, msg: 'Enter a password or email' });
    } else {
      const newUser = new Account({ username: req.body.username, password: req.body.password });

      newUser.save((err) => {
        if (err) {
          return res.json({ success: false, msg: 'Username already exists' });
        }

        res.json({ success: true, msg: 'New user made' });
      });
    }
  });

router
  .route('/authenticate')
  .post((req, res) => {
    Account.findOne({
      username: req.body.username,
    }, (err, user) => {
      if (err) {
        res.send(err);
      }

      if (!user) {
        res.send({ success: false, msg: 'Authentication faild. User not found' });
      } else {
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (isMatch && !err) {
            const token = jwt.sign({
              _id: user._id,
              username: user.username,
              password: user.password,
            }, process.env.JWT_SECRET, { expiresIn: 4000 });

            res.json({ success: true, token: `JWT ${token}` });
          } else {
            res.send({ success: false, msg: 'Authentication failed. Wrong password or Email.' });
          }
        });
      }
    });

    // res.send({message: "Logged in", success: true, token})
  });

router
  .route('/logout')
  .get((req, res) => {
    req.logout();
    res.json({ message: 'Logged out' });
  });
module.exports = router;
