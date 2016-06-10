const express = require('express');
const bodyParser = require('body-parser');
const middlewares = require('../lib/middlewares');
const token = require('../lib/token');
const User = require('../models/user.model');
const SubTopic = require('../models/subtopic.model');
const Topic = require('../models/topic.model');

const router = module.exports = express.Router();
const jsonParser = bodyParser.json();

router
  .get('/validate', middlewares.validateToken, (req, res) => {
    res.json({
      status: 'success',
      result: true
    });
  });

router
  .post('/register', jsonParser, (req, res) => {
    
    const input = {
      username: req.body.username,
      password: req.body.password,
      topic: req.body.topic,
      skills: req.body.skills
    };
    delete req.body.password;
    
// if input subtopic does not exist, create one
    
    const skillPromise = SubTopic.findOne({name: input.skills})
      .then(subtopic => {
        if (subtopic) {       
          return subtopic._id;    
        } else {
          return new SubTopic({name: input.skills, topic: input.topic})
            .save()
            .then(sub => {
              return sub._id;
            });   
        }
      });

    const userPromise = User.findOne({username: input.username})
      .then((foundUser) => {
        if (foundUser) {
          throw `Username: ${foundUser.username} already exists`;
        }
      });

// ------  U S E R   C R E A T I O N  ------

    Promise.all([skillPromise, userPromise])
      .then(([subTopicId]) => {
        
        Topic.findById(input.topic)
            .then(topic => {
              if (topic.subTopics.indexOf(subTopicId) === -1) {
                topic.subTopics.push(subTopicId);
                topic.save();
              }
            });
        
        const newUser = new User({
          username: input.username,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          gender: req.body.gender,
          zip: req.body.zip,
          skills: subTopicId
        });
        newUser.makeHash(input.password);

        delete input.password;

        return newUser.save();
      })
      .then(user => token.sign(user))
      .then(userObj => {
        res.json({
          status: 'success',
          result: userObj
        });
      })
      .catch(err => {
        res.status(400).json({
          status: 'error',
          result: 'Server error',
          error: err
        });
      });
  });

//   Login

router
  .post('/login', jsonParser, (req, res) => {
    const input = {
      username: req.body.username,
      password: req.body.password
    };

    delete req.body.password;

    User.findOne({username: input.username})
      .then(foundUser => {
        if (foundUser === null) {
          delete input.password;

          return res.status(400).json({
            status: 'error',
            result: 'Username Not Found'
          });
        }

        if (foundUser.checkHash(input.password) == false) {
          delete input.password;

          return res.status(403).json({
            status: 'error',
            result: 'Forbidden'
          });
        }

        delete input.password;

        token.sign(foundUser)
          .then(userObj => {
            res.json({
              status: 'success', 
              result: userObj
            });
          })
          .catch(err => {
            res.json({
              status: 'error',
              result: 'The username and password does not match.',
              error: err
            });
          });
      })
      .catch(err => {
        res.json({
          status: 'error',
          result: 'The username and password does not match.',
          error: err
        });
      });
  });
