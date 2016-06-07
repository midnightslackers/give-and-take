const jwt = require('jsonwebtoken');

const token = {};

token.sign = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {id: user._id},
      process.env.JWT_SECRET,
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
      process.env.JWT_SECRET,
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
