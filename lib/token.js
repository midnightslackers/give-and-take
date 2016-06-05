const jwt = require('jsonwebtoken');
const config = require('./config');

const token = {};

token.sign = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {id: user._id},
      config.jwt_secret,
      null,
      (err, token) => {
        if (err) return reject(err);
        resolve(token);
      }
    );
  });
};

token.verify = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      config.jwt_secret,
      (err, payload) => {
        if (err) return reject(err);
        resolve(payload);
      }
    );
  });
};

token.validate = (req, res, next) => {
  let reqToken = req.headers.token || req.query.token;

  if (reqToken) {
    token.verify(reqToken).then(payload => {
      req.user = payload;
      next();
    }).catch(() => {
      res.status(400).json({
        status: 'error',
        error: 'Invalid token'
      });
    });
  } else {
    res.status(400).json({
      status: 'error',
      result: 'No token provided'
    });
  }
};

module.exports = token;
