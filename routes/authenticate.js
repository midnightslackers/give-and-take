const router = require('express').Router();
const jsonParser = require('body-parser').json();
const User = require('../models/user.model');
const token = require('../lib/token');

router
  .post('/register', jsonParser, (req, res) => {

    const input = {
      username: req.body.username,
      password: req.body.password
    };

    delete req.body.password;

    User.findOne({username: input.username})
      .then((foundUser) => {
        if (foundUser !== null) return res.json({status: 'error', result: `Username: ${foundUser.username} already exists`});

        const newUser = new User({username: input.username});
        newUser.makeHash(input.password);
        delete input.password;
        return newUser.save()
          .then(user => {
            token.sign(user)
              .then(token => {
                res.json({status: 'success', result: token});
              })
              .catch(err => {
                res.json({status: 'error', result: err});
              });
            // res.json({status: 'success', result: `user: ${user.username} created`});
          })
          .catch(err => {
            res.status(400);
            res.json({status: 'error', result: err});
          });

      }).catch(err => {
        res.status(400);
        res.json({status: 'error', result: err});
      });

  });

router
  .post('/login', jsonParser, (req, res) => {

    const input = {
      username: req.body.username,
      password: req.body.password
    };

    delete req.body.password;

    User.findOne({username: input.username})
      .then(foundUser => {
        if (foundUser === null) {
          delete input.password;
          return res.status(400).json({status: 'error', result: 'Username Not Found'});
        }
        if (foundUser.checkHash(input.password) == false) {
          delete input.password;
          return res.status(403).json({status: 'error', result: 'Forbidden'});
        }
        delete input.password;
        token.sign(foundUser)
              .then(token => {
                res.json({status: 'success', result: token});
              })
              .catch(err => {
                res.json({status: 'error', result: err});
              });
        // res.json({status: 'success', result: 'LOGGED IN BB!'});
      })
      .catch(err => {
        res.json({status: 'error', result: err});
      });

  });


module.exports = router;
