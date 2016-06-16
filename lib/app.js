const express = require('express');
const middlewares = require('../lib/middlewares');
const users = require('../routes/users');
const auth = require('../routes/authentication');
const topics = require('../routes/topics');
const subtopics = require('../routes/subtopics');
const app = module.exports = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('../views/pages/index.page.pug', {
    bodyClass: 'page--home hide'
  });
});

app.get('/about', (req, res) => {
  res.render('../views/pages/about.page.pug', {
    bodyClass: 'page--about'
  });
});

app.get('/dashboard', /* middleware.checkAdmin, */ (req, res) => {
  res.render('../views/pages/dashboard.page.pug');
});

app.use('/api/auth', auth);
app.use('/api/users', middlewares.validateToken, users);
app.use('/api/topics', middlewares.validateToken, topics);
app.use('/api/subtopics', middlewares.validateToken, subtopics);
app.use(middlewares.errorHandler);
