const app = require('./lib/app');
const database = require('./lib/database');

database.connect(process.env.MONGODB_URI);

app.listen(process.env.PORT, () => {
  console.log(`Magic happens at http://localhost:${process.env.PORT}/`);
});
