const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user.model');
const Topic = require('../models/topic.model');
const SubTopic = require('../models/subtopic.model');

const notification = require('../lib/notification');

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
  // filter users by subtopic
  .get('/bysubtopic/:subtopicId', (req, res) => {
    User
      .find({
        skills: req.params.subtopicId
      })
      .then(userList => {
        let resObj = {
          status: 'error',
          result: 'There are no users with matching subtopic'
        };

        if (userList.length > 0) {
          resObj.status = 'success';
          resObj.result = userList;
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
  
  // filter users by TOPIC 
  
  .get('/bytopic/:topicId', (req, res) => {
    
    const subPromise = Topic.findById(req.params.topicId)
      .then(foundTopic => {
        if (foundTopic) return foundTopic;
        else throw `TopicId: ${req.params.topicId} does not exist`;
      })
      .then(foundTopic => {
        SubTopic
          .findOne({
            topic: foundTopic._id
          })
          .then(sub => {
            if (sub) return sub._id;
            else {
              throw `${foundTopic.name} has no subtopics`;
            }
          });
      })
      .then(subId => {
        User
          .find({
            skills: subId
          })
          .then(userList => {
            let resObj = {
              status: 'error',
              result: 'There are no users with matching topic'
            };

            if (userList.length > 0) {
              resObj.status = 'success';
              resObj.result = userList;
            }

            res.json(resObj);
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
   
  // ===
  .get('/:userId', (req, res) => {
    User
      .findById(req.params.userId)
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
    notification.send(
      req.body.recipient,
      req.body.senderEmail,
      req.body.senderName,
      req.body.message,
      function(err, json) {
        if (err) {
          res.json({
            status: 'error',
            result: 'There was a problem sending the message',
            error: err
          });
        } else {
          res.json({
            status: 'success',
            result: json,
          });
        }
        
      }
    );
  });
  
