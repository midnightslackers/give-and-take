const chai = require('chai');
const chaiHttp = require('chai-http');
const database = require('../lib/database');
const app = require('../lib/app');

const assert = chai.assert;
const databaseConnection = database.connect(process.env.MONGODB_URI);

chai.use(chaiHttp);

// good work putting in some api tests!

describe('End to End Testing', () => {
  let request = chai.request(app);
  let user1 = {
    firstname: 'User',
    lastname: '1',
    username: 'User1',
    password: 'test123',
    gender: 'male',
    zip: 97204,
    skills: 'piano'
  };
  let id;
  let token;

  before(done => {
    databaseConnection.on('open', () => {
      databaseConnection.collections['subtopics'].drop();
      databaseConnection.collections['topics'].drop();
      databaseConnection.collections['users'].drop();
      done();
    });
  });

  describe('Topics', () => {

    let topic1 = {};

    it('creates a topic', done => {
      let expected = {
        name: 'History'
      };

      request
        .post('/api/topics')
        .set('Content-Type', 'application/json')
        .send(expected)
        .end((err, res) => {
          if (err) return done(err);

          let actual = res.body;

          assert.property(actual, 'status');
          assert.equal(actual.status, 'success');
          assert.property(actual, 'result');
          assert.property(actual.result, '_id');
          assert.property(actual.result, 'name');
          assert.equal(actual.result.name, expected.name);

          topic1.id = actual.result._id;
          topic1.name = actual.result.name;

          user1.topic = actual._id;

          done();
        });
    });

    it('gets all topics', done => {
      request
        .get('/api/topics')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          if (err) return done(err);

          let actual = res.body;

          assert.property(actual, 'status');
          assert.equal(actual.status, 'success');
          assert.property(actual, 'result');
          assert.property(actual.result[0], '_id');
          assert.equal(actual.result[0]._id, topic1.id);
          assert.property(actual.result[0], 'name');
          assert.equal(actual.result[0].name, topic1.name);

          done();
        });
    });

    it('gets a topic by id', done => {
      request
        .get(`/api/topics/${topic1.id}`)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          if (err) return done(err);

          let actual = res.body;

          assert.property(actual, 'status');
          assert.equal(actual.status, 'success');
          assert.property(actual, 'result');
          assert.property(actual.result, '_id');
          assert.equal(actual.result._id, topic1.id);
          assert.property(actual.result, 'name');
          assert.equal(actual.result.name, topic1.name);

          done();
        });
    });

  });

  describe('Authentication', () => {

    it('registers new user on register', done => {
      request
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send(user1)
        .end((err, res) => {
          if (err) return done(err);

          let actual = res.body;

          assert.property(actual, 'status');
          assert.equal(actual.status, 'success');
          assert.property(actual, 'result');
          assert.property(actual.result, 'firstname');
          assert.property(actual.result, 'token');
          assert.property(actual.result, 'userId');
          assert.equal(actual.result.firstname, user1.firstname);

          id = actual.result.userId;
          token = actual.result.token;

          done();
        });
    });

    it('error on duplicate username input on register', done => {
      request
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send(user1)
        .end(err => {
          // don't forget this!
          if (err) return done(err);

          let actual = err.response.body;

          assert.property(actual, 'status');
          assert.equal(actual.status, 'error');
          assert.property(actual, 'result');
          assert.equal(actual.result, 'Server error');
          assert.property(actual, 'error');
          assert.equal(actual.error, 'Username: User1 already exists');

          done();
        });
    });

    it('error on password mismatch on login', done => {
      request
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          username: 'User1',
          password: 'wrong'
        })
        .end(err => {
          if (err) return done(err);

          let actual = err.response.body;

          assert.property(actual, 'status');
          assert.equal(actual.status, 'error');
          assert.property(actual, 'result');
          assert.equal(actual.result, 'Forbidden');

          done();
        });
    });

    it('error on bad username on login', done => {
      request
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          username: 'not_a_user',
          password: 'test123'
        })
        .end((err) => {
          if (err) return done(err);

          let actual = err.response.body;

          assert.property(actual, 'status');
          assert.equal(actual.status, 'error');
          assert.property(actual, 'result');
          assert.equal(actual.result, 'Username Not Found');

          done();
        });
    });

    it('user success on login', done => {
      request
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send(user1)
        .end((err, res) => {
          if (err) return done(err);

          let actual = res.body;

          assert.property(actual, 'status');
          assert.equal(actual.status, 'success');
          assert.property(actual, 'result');
          assert.property(actual.result, 'firstname');
          assert.property(actual.result, 'token');
          assert.property(actual.result, 'userId');
          assert.equal(actual.result.firstname, user1.firstname);

          token = actual.result.token;

          done();
        });
    });

  });

  describe('User', () => {

    it.skip('deletes new user on /register', done => {
      request
        .del(`/api/users/${id}`)
        .set('Content-Type', 'application/json')
        .set('token', token)
        .end((err, res) => {
          if (err) return done(err);

          let actual = res.body;

          assert.property(actual, 'status');
          assert.equal(actual.status, 'success');
          assert.property(actual, 'result');
          assert.property(actual.result, '_id');
          assert.equal(actual.result._id, id);

          done();
        });
    });

    it.skip('Posts one user to users collection', done => {
      // use `const` if the variable will not be reassigned
      const username = 'Johnny';
      const password = '123';

      request
        .post('/api/users')
        .set('content-type', 'application/json')
        .set('token', token)
        .send({
          // use same name for simpler syntax
          username,
          password
        })
        .end((err, res) => {
          if (err) return done(err);

          let resObj = res.body;

          assert.equal(res.status, 200);
          assert.property(resObj, 'status');
          assert.equal(resObj.status, 'posted');
          assert.property(resObj, 'result');
          assert.isObject(resObj.result);
          assert.property(resObj.result, '_id');
          assert.property(resObj.result, 'username');
          assert.equal(resObj.result.username, myUserName);
          assert.property(resObj.result, 'password');
          assert.property(resObj.result, 'createdAt');
          assert.property(resObj.result, 'updatedAt');

          done();
        });
    });

    it.skip('Posts another user and gets three users', done => {
      let myUserName = 'Don';
      let myPassword = 'abc';

      request
        .post('/api/users')
        .set('content-type', 'application/json')
        .set('token', token)
        .send({
          username: myUserName,
          password: myPassword
        })
        .then(() => {
          request
            .get('/api/users')
            .set('content-type', 'application/json')
            .set('token', token)
            .end((err, res) => {
              let resObj = JSON.parse(res.text);

              assert.equal(resObj.result.length, 3);

              done();
            });
        });
    });

    it('Gets all users', done => {
      request
        .get('/api/users')
        .set('content-type', 'application/json')
        .set('token', token)
        .then(res => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'status');
          assert.equal(res.body.status, 'success');
          assert.property(res.body, 'result');
          assert.isArray(res.body.result);

          res.body.result.forEach(user => {
            assert.property(user, '_id');
            assert.property(user, 'username');
            assert.property(user, 'password');
            assert.property(user, 'firstname');
            assert.property(user, 'lastname');
            assert.property(user, 'gender');
            assert.property(user, 'zip');
            assert.property(user, 'skills');
            assert.property(user, 'admin');
            assert.property(user, 'createdAt');
            assert.property(user, 'updatedAt');
          });

          done();
        });
    });

    it.skip('Throws specific validation error on name requirement', done => {
      let expected = 'User Creation Failed';

      request
        .post('/api/users')
        .set('content-type', 'application/json')
        .set('token', token)
        .send({
          'password': 'secret123'
        })
        .end((err, res) => {
          let resObj = res.body;

          assert.equal(resObj.result, expected);

          done();
        });
    });

    it.skip('Gets one user', done => {
      request
        .get('/api/users/johnny')
        .set('content-type', 'application/json')
        .set('token', token)
        .end((err, res) => {
          let resObj = JSON.parse(res.text);

          assert.equal(resObj.result.username, 'Johnny');

          done();
        });
    });

    it.skip('Puts "jluangphasy" as new username for johnny', done => {
      request
        .put('/api/users/Johnny')
        .set('content-type', 'application/json')
        .set('token', token)
        .send({
          username: 'jluangphasy'
        })
        .then(() => {
          request
            .get('/api/users/jluangphasy')
            .set('content-type', 'application/json')
            .set('token', token)
            .end((err, res) => {
              let resObj = JSON.parse(res.text);

              assert.equal(resObj.result.username, 'jluangphasy');

              done();
            });
        });
    });

    it.skip('Deletes one user, then all of the others', done => {
      request
        .del('/api/users/jluangphasy')
        .set('content-type', 'application/json')
        .set('token', token)
        .then(() => {
          request
            .del('/api/users/don')
            .set('content-type', 'application/json')
            .set('token', token)
            .then(() => {
              request
                .del(`/api/users/${user1.username}`)
                .set('content-type', 'application/json')
                .set('token', token)
                .then(() => {
                  request
                    .get('/api/users')
                    .set('content-type', 'application/json')
                    .set('token', token)
                    .end((err, res) => {
                      let resObj = JSON.parse(res.text);

                      assert.equal(resObj.result, 'There are no users yet. Post here to start adding some.');

                      done();
                    });
                });
            });
        });
    });

  });

  after(done => {
    databaseConnection.close(done);
  });

});
