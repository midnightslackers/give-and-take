const handlers =  {};

handlers.error = (req, res) => {
  res
    .status(404)
    .json({
      status: 'error',
      results: 'PAGE NOT FOUND: the url path provided does not exist.'
    });
};

handlers.json = (req, res, next) => {
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

module.exports = handlers;
