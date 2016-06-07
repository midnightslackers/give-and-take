const express = require('express');
const handlers = require('../lib/handlers');
const users = require('../routes/users');
const auth = require('../routes/authenticate');
const topics = require('../routes/topics');
const token = require('./token');

const app = express();

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.render('../views/pages/index.page.pug');
});
app.use(handlers.json);
app.use('/', auth);
app.use('/api/users', token.validate, users);
app.use('/api/topics', topics);
app.use(handlers.error);

module.exports = app;
