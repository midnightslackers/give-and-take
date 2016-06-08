const express = require('express');
const bodyParser = require('body-parser');
const regex = require('../lib/regex.js');
const User = require('../models/user.model');

const router = module.exports = express.Router();
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
      })
      .catch(err => {
        res.json({
          status: 'error',
          result: 'Server error',
          error: err
        });
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
      })
      .catch(err => {
        res.json({
          status: 'error',
          result: 'Server error',
          error: err
        });
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
        res.json({
          status: 'error',
          result: 'User Creation Failed',
          error: err
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
          status: 'success',
          result: user
        });
      })
      .catch(err => {
        res.json({
          status: 'error',
          result: 'Server error',
          error: err
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
          status: 'success',
          result: user
        });
      })
      .catch(err => {
        res.json({
          status: 'error',
          result: 'Server error',
          error: err
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
          resObj.status = 'success';
          resObj.result = user;
        }

        res.json(resObj);
      })
      .catch(err => {
        res.json({
          status: 'error',
          result: 'Server error',
          error: err
        });
      });
  });
