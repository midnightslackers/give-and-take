const express = require('express');
const middlewares = require('../lib/middlewares');
const users = require('../routes/users');
const auth = require('../routes/authenticate');
const topics = require('../routes/topics');

const app = module.exports = express();

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.render('../views/pages/index.page.pug');
});

app.get('/dashboard', middlewares.validateToken, (req, res) => {
  res.render('../views/pages/dashboard.page.pug');
});

// app.use(middlewares.jsonHandler);
app.use('/', auth);
app.use('/api/users', middlewares.validateToken, users);
app.use('/api/topics', topics);
app.use(middlewares.errorHandler);
