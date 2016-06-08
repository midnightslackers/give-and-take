const token = require('./token');

const middlewares = module.exports;

middlewares.errorHandler = (req, res) => {
  res
    .status(404)
    .json({
      status: 'error',
      results: 'PAGE NOT FOUND: the url path provided does not exist.'
    });
};

middlewares.jsonHandler = (req, res, next) => {
  if (req.is('application/json') || req.headers['content-type'] == 'application/json') {
    next();
  } else {
    res
      .status(406)
      .json({
        status: 'error',
        result: 'NOT ACCEPTABLE: content-type must be set to application/json in the headers.'
      });
  }
};

middlewares.validateToken = (req, res, next) => {
  let reqToken = req.headers.token || req.query.token;

  if (reqToken) {
    token.verify(reqToken).then(payload => {
      req.user = payload;
      next();
    }).catch(err => {
      res.status(400).json({
        status: 'error',
        result: 'Invalid token',
        error: err
      });
    });
  } else {
    res.status(400).json({
      status: 'error',
      result: 'No token provided'
    });
  }
};
