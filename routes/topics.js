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
      .then(topic => {
        let resObj = {
          status: 'error',
          result: 'No Topics Added.'
        };

        if (topic.length > 0) {
          resObj.status = 'success';
          resObj.result = topic;
        }

        res.json(resObj);
      });
  })
  // Retrieve Single Topic object 
  .get('/:topicId', (req, res) => {
    Topic
      .findOne({
        _id: req.params.topicId
      })
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
      });
  })
// Retrieve All SubTopics in Topic
  .get('/:topicId/subtopics', (req, res) => {
    Topic
      .findOne({
        _id: req.params.topicId
      })
      .then(topic => {
        const subList = topic.subTopics;
        let resObj = {
          status: 'error',
          result: `No Subtopics exist in ${topic.name}`
        };
        if (subList.length > 0) {
          resObj.status = 'success';
          resObj.result = subList;
        }
        res.json(resObj);
      })
      .catch(err => {
        res.json({
          status: 'error',
          result: err
        });
      });
  });
  
  
// Push new subtopic into a specific topic


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
          });
      })
      .then(topic => {
        res.json({status: 'success!', result: topic});
      })
      .catch(err => {
        res.json({status: 'error', result: err});
      });
  });


// Temp POST major topics ADMIN ONLY***
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
          let key = Object.keys(err.errors)[0];

          res.json({
            status:'error',
            result: err.errors[key].message
          });
        });
    });
