const config = require('./lib/config');
const app = require('./lib/app');
const database = require('./lib/database');

database.connect(config.mongodb_uri);

app.listen(config.port, () => {
  console.log(`Magic happens at http://localhost:${config.port}/`);
});
