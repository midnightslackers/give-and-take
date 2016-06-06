const express = require('express');
const bodyParser = require('body-parser');
const Topic = require('../models/topic.model');

const router = express.Router();
const jsonParser = bodyParser.json();

router

// Retrieve all Users by Topic

  .get('/api/topics/:category', (req, res) => {
    Topic
      .findOne({
        category: {}
      })
      .then(topic => {
        let resObj = {
          status: 'error',
          result: `TOPIC NOT FOUND: ${req.params.category} does not exist.`
        };

        if (topic) {
          resObj.status = 'success';
          resObj.result = topic;
        }

        res.json(resObj);
      });
  })

//Retrieve all Users by Topic Subcategory

  .get('/api/topics/:category/:subcategory', (req, res) => {
    Topic
      .findOne({
        subcategory:{}
      })
      .then(topic => {
        let resObj = {
          status: 'error',
          result: `SUBCATEGORY NOT FOUND: ${req.params.subcategory} does not exist.`
        };

        if (topic) {
          resObj.status = 'success';
          resObj.result = topic;
        }

        res.json(responseObject);
      });
  });

//create new Subcategory in Topics

router
    .use(jsonParser)
    .post('/api/topics/:category/:subcategory',(req, res) => {
      new Topic(req.body)
        .save()
        .then(topic => {
          res.json({
            status:'posted',
            result: topic
          });
        }).catch(err => {
          let key = Object.keys(err.errors);

          res.json({
            status:'error',
            result: err.errors[key].message
          });
        });
    });
