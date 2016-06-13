const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const uploader = function(req, res, next) {
  console.log(req.files.image);
  res.send(req.files.image);
};

module.exports = uploader;