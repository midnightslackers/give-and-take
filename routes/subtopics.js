const express = require('express');
const SubTopic = require('../models/subtopic.model');
const router = module.exports = express.Router();

// GET all Subtopics

router  
  .get('/', (req, res) => {
    SubTopic
      .find({})
      // .select('name')
      .lean()
      .then(subs => {
        let resObj = {
          status: 'error',
          result: 'No Subtopics Added.'
        };

        if (subs.length > 0) {
          resObj.status = 'success';
          resObj.result = subs;
        }

        res.json(resObj);
      })
      .catch(err => {
        res.json({
          status: 'error',
          result: 'Could not retrieve subtopic list',
          error: err
        });
      });
  })
  
// GET one subtopic

  .get('/:subId', (req, res) => {
    SubTopic
      .findById(req.params.subId)
      .lean()
      .then(sub => {
        let resObj = {
          status: 'error',
          result: 'No Subtopics Added.'
        };

        if (sub) {
          resObj.status = 'success';
          resObj.result = sub;
        }

        res.json(resObj);
      })
      .catch(err => {
        res.json({
          status: 'error',
          result: 'Could not retrieve subtopic',
          error: err
        });
      });
  });