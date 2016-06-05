const config = {
  mongodb_uri: process.env.MONGODB_URI || 'mongodb://localhost/give-and-take',
  jwt_secret: process.env.JWT_SECRET || 'trade',
  port: process.env.PORT || 8080
};

module.exports = config;
