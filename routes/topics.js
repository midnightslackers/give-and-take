const express = require('express');
const bodyParser = require('body-parser');
const Topic = require('../models/topic.model');

const router = express.Router();
const jsonParser = bodyParser.json();

router

// Retrieve all Users by Topic

  .get('/', (req, res) => {
    Topic
      .find({})
      .then(topic => {
        let resObj = {
          status: 'error',
          result: `No Topics Added.`
        };

        if (topic.length > 0) {
          resObj.status = 'success';
          resObj.result = topic;
        }

        res.json(resObj);
      });
  })

  .get('/:topic', (req, res) => {
    Topic
      .findOne({
        name: req.params.topic
      })
      .then(topic => {
        let resObj = {
          status: 'error',
          result: `TOPIC NOT FOUND: ${req.params.topic} does not exist.`
        };

        if (topic) {
          resObj.status = 'success';
          resObj.result = topic;
        }

        res.json(resObj);
      });
  });


//create new Subcategory in Topics

router
    .use(jsonParser)
    .post('/:topic', (req, res) => {
      Topic 
        .findOne({name: req.params.topic})
        .then(topic => {
          topic.subcategories.push(req.body.name);
          return topic.save();
        })
        .then(topic => {
          res.json({status: 'success', result: topic});
        }).catch(err => {
          res.json({
            status:'error',
            result: err
          });
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
    
module.exports = router;
