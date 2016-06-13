const express = require('express');
const bodyParser = require('body-parser');
const notification = require('../lib/notification');
const User = require('../models/user.model');
const Topic = require('../models/topic.model');
const SubTopic = require('../models/subtopic.model');

const router = module.exports = express.Router();
const jsonParser = bodyParser.json();

router
  .get('/', (req, res) => {
    User
      .find()
      .populate({
        path: 'skills',
        populate: {
          path: 'topic'
        }
      })
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
      .populate({
        path: 'skills',
        populate: {
          path: 'topic'
        }
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

    Topic.findById(req.params.topicId)
      .then(foundTopic => {
        if (foundTopic) return foundTopic;
        else throw `TopicId: ${req.params.topicId} does not exist`;
      })
      .then(foundTopic => {
        return SubTopic
          .find({
            topic: foundTopic._id
          });
      })
      .then(subList => {
        if (subList) {

          return subList.map(sub => {
            return sub._id;
          });
        }
        else {
          throw `${foundTopic.name} has no subtopics`;
        }
      })
      .then(subIdArray => {
        User
          .find({
            skills: {
              $in: subIdArray
            }
          })
          .populate({
            path: 'skills',
            populate: {
              path: 'topic'
            }
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

  .get('/bygender/:gender', (req, res) => {
    User
      .find({
        gender: req.params.gender
      })
      .populate({
        path: 'skills',
        populate: {
          path: 'topic'
        }
      })
      .then(userList => {
        let resObj = {
          status: 'error',
          result: 'There are no users with matching gender'
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

  // ===
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
    console.log('PUT', req.files);
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
        if (user) {
          notification.send(
            user.username,
            req.body.senderEmail,
            req.body.senderName,
            req.body.message,
            (err, json) => {
              if (err) {
                res.json({
                  status: 'error',
                  result: 'There was a problem sending the message',
                  error: err
                });
              } else {
                res.json({
                  status: 'success',
                  result: json
                });
              }
            });
        } else {
          res.json({
            status: 'error',
            result: `RESOURCE NOT FOUND: ${req.body.recipientId} does not exist.`
          });
        }
      });
  });
