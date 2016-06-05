const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user.model');
const regex = require('../lib/regex.js');

const router = express.Router();
const jsonParser = bodyParser.json();

router
  .get('/', (req, res) => {
    User
      .find()
      .then(users => {
        let resObj = {
          status: 'error',
          result: 'There are no users yet. Post here to start adding some.'
        };

        if (users.length > 0) {
          resObj.status = 'success';
          resObj.result = users;
        }

        res.json(resObj);
      });
  })
  .get('/:username', (req, res) => {
    User
      .findOne({
        username: {
          $regex: regex.new(req.params.username)
        }
      })
      .then(user => {
        let resObj = {
          status: 'error',
          result: `RESOURCE NOT FOUND: ${req.params.username} does not exist.`
        };

        if (user) {
          resObj.status = 'success';
          resObj.result = user;
        }

        res.json(resObj);
      });
  });

router
  .use(jsonParser)
  .post('/', (req, res) => {
    new User(req.body)
      .save()
      .then(user => {
        res.json({
          status: 'posted',
          result: user
        });
      }).catch(err => {
        let key = Object.keys(err.errors);

        res.json({
          status: 'error',
          result: err.errors[key].message
        });
      });
  })
  .put('/:username', (req, res) => {
    User
      .findOneAndUpdate(
        { username: req.params.username},
        req.body,
        { new: true, upsert: true, runValidators: true }
      )
      .then(user => {
        res.json({
          status: 'updated',
          result: user
        });
      })
      .catch(err => {
        let key = Object.keys(err.errors);

        res.json({
          status: 'error',
          result: err.errors[key].message
        });
      });
  })
  .patch('/:username', (req, res) => {
    User
      .findOneAndUpdate(
        { username: req.params.username},
        req.body,
        { new: true, upsert: true, runValidators: true }
      )
      .then(user => {
        res.json({
          status: 'updated',
          result: user
        });
      })
      .catch(err => {
        let key = Object.keys(err.errors);

        res.json({
          status: 'error',
          result: err.errors[key].message
        });
      });
  })
  .delete('/:username', (req, res) => {
    User
      .findOneAndRemove({
        username: regex.new(req.params.username)
      })
      .then(user => {
        let resObj = {
          status: 'error',
          result: `RESOURCE NOT FOUND: ${user} does not exist.`
        };

        if (user) {
          resObj.status = 'deleted';
          resObj.result = user;
        }

        res.json(resObj);
      });
  });

module.exports = router;
