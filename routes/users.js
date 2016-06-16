const express = require('express');
const bodyParser = require('body-parser');
const notification = require('../lib/notification');
const User = require('../models/user.model');
const Topic = require('../models/topic.model');
const SubTopic = require('../models/subtopic.model');

const router = module.exports = express.Router();
const jsonParser = bodyParser.json();

// Http already has a statusCode, so I really don't see the
// need to return a "response object" that has a status code.

// I also don't think lack of data qualifies as an error,
// but I've included some of them to show using throw

// Using query parameters for filters reduces boilerplate repetition
// of User.find and is more RESTy

// Use throw with Promise chain and then use expresses next(err)
// middleware feature to reduce boiler plate.

router
  .get('/', (req, res, next) => {
    const query = {};
    if( req.query.subtopicId ) query.subtopicId = req.query.subtopicId;
    if( req.query.gender ) query.gender = req.query.gender;
    
    let queryPromise = null;
    
    if ( req.query.topicId ) {
      queryPromise = SubTopic
          .find({
            topic: req.query.topicId
          })
          .select('') // just need id's
          .lean()
          .then((subList = []) => {
            query.skills = {
              $in: subList.map(sub => sub._id)
            };
            return query;
          });
    }
    else {
      queryPromise = Promise.resolve(query);
    }

    queryPromise
      .then( query => {
        return User
          .find(query)
          .populate({
            path: 'skills',
            populate: {
              path: 'topic'
            }
          })
          .lean();
      })
      .then(users => {
        if (!users || !users.length) throw 'There are no users yet. Post here to start adding some.';
        res.json(users);
      })
      // create a custom next error handling middleware 
      // and you don't have to repeat this
      .catch(next);
  })

  .get('/:userId', (req, res) => {
    User
      .findById(req.params.userId)
      .populate({
        path: 'skills',
        populate: {
          path: 'topic'
        }
      })
      .then(user => {
        let resObj = {
          status: 'error',
          result: `RESOURCE NOT FOUND: ${req.params.userId} does not exist.`
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
          status: 'success',
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
  .put('/:userId', (req, res) => {
    User
      .findOneAndUpdate(
        { _id: req.params.userId},
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
  .patch('/:userId', (req, res) => {
    User
      .findOneAndUpdate(
        { _id: req.params.userId},
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
  .delete('/:userId', (req, res) => {
    User
      .findOneAndRemove({
        _id: req.params.userId
      })
      .then(user => {
        let resObj = {
          status: 'error',
          result: `RESOURCE NOT FOUND: ${req.params.userId} does not exist.`
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

// endpoint for messaging --------

router
  .use(jsonParser)
  .post('/:userId/message', (req, res) => {
    User
      .findById(req.body.recipientId)
      .then(user => {
        if (!user) throw `RESOURCE NOT FOUND: ${req.body.recipientId} does not exist.`;
        return notification.send(
            user.username,
            req.body.senderEmail,
            req.body.senderName,
            req.body.message);
      })
      .then(json => {
        res.json({
          status: 'success',
          result: json
        });
      })
      .catch(next);
  });
