const express = require('express');
const middlewares = require('../lib/middlewares');
const users = require('../routes/users');
const auth = require('../routes/authentication');
const topics = require('../routes/topics');

const app = module.exports = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('../views/pages/index.page.pug');
});

app.get('/about', (req, res) => {
  res.render('../views/pages/about.page.pug');
});

app.get('/dashboard', (req, res) => {
  res.render('../views/pages/dashboard.page.pug');
});

// app.use(middlewares.jsonHandler);
app.use('/api/auth', auth);
app.use('/api/users', middlewares.validateToken, users);
app.use('/api/topics', topics);
app.use(middlewares.errorHandler);
