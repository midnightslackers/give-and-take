const express = require('express');
const bodyParser = require('body-parser');
const Topic = require('../models/topic.model');
const SubTopic = require('../models/subtopic.model');
const router = module.exports = express.Router();
const jsonParser = bodyParser.json();

router
  // Retrieve all topic Objects
  .get('/', (req, res) => {
    Topic
      .find({})
      // .select('name')
      .lean()
      .then(topics => {
        let resObj = {
          status: 'error',
          result: 'No Topics Added.'
        };

        if (topics.length > 0) {
          resObj.status = 'success';
          resObj.result = topics;
        }

        res.json(resObj);
      });
  })
  // Retrieve Single Topic object 
  .get('/:topicId', (req, res) => {
    Topic
      .findById(req.params.topicId)
      .populate({
        path: 'subTopics',
        populate: {
          path: 'topic',
          select: 'name'
        }
      })
      .lean()
      .then(topic => {
        let resObj = {
          status: 'error',
          result: `TOPIC NOT FOUND: ${topic.name} does not exist.`
        };

        if (topic) {
          resObj.status = 'success';
          resObj.result = topic;
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

  
// Retrieve One Subtopic in Specified topic

router  
  .get('/:topicId/:subTopicId', (req, res) => {
    SubTopic 
      .findOne({
        _id: req.params.subTopicId
      })
      .then(subTopic => {
        let resObj = {
          status: 'error',
          result: 'subtopic not found.'
        };

        if (subTopic) {
          resObj.status = 'success';
          resObj.result = subTopic;
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
  
  
// POST new subtopic & Push new subtopic into a specific topic
router
  .use(jsonParser)
  .post('/:topicId', (req, res) => {
    new SubTopic(req.body)
      .save()
      .then(sub => {
        Topic
          .findOne({
            _id: req.params.topicId
          })
          .then(topic => {
            topic.subTopics.push(sub._id);
            return topic.save();
          })
          .then(topic => {
            res.json({
              status: 'success', 
              result: topic
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
      .catch(err => {
        res.json({
          status: 'error', 
          result: 'Server error',
          error: err
        });
      });
  });
  

//  POST major topics ADMIN ONLY***
router
    .use(jsonParser)
    .post('/', (req, res) => {
      new Topic(req.body)
        .save()
        .then(topic => {
          res.json({
            status:'posted',
            result: topic
          });
        }).catch(err => {
          res.json({
            status:'error',
            result: 'server err',
            error: err
          });
        });
    });
