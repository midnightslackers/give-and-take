const chai = require('chai');
const chaiHttp = require('chai-http');
const database = require('../lib/database');
const app = require('../lib/app');
const User = require('../models/user.model');

const assert = chai.assert;

chai.use(chaiHttp);
database.connect(process.env.MONGODB_URI);

describe('End to End Testing', () => {
  let request;
  let token;
  let user1 = {username: 'user1', password: 'test123'};

  before(done => {
    request = chai.request(app);
    done();
  });

  describe('Authentication', () => {
    before(done => {
      User.remove({})
        .then(done());
    });

    it ('registers new user on /register', done => {
      request
        .post('/register')
        .send(user1)
        .end((err, res) => {
          const actual = JSON.parse(res.text);
          assert.equal(actual.status, 'success');
          // assert.equal(actual.result, expected);
          token = actual.result;
          done();
        });
    });

    it ('error on duplicate username input on /register', done => {
      const expected = 'Username: user1 already exists';
      request
        .post('/register')
        .send(user1)
        .end((err, res) => {
          const actual = JSON.parse(res.text);
          assert.equal(actual.status, 'error');
          assert.equal(actual.result, expected);
          done();
        });
    });

    it ('user success on /login', done => {
      request
        .post('/login')
        .send(user1)
        .end((err, res) => {
          const actual = JSON.parse(res.text);
          assert.equal(actual.status, 'success');
          done();
        });
    });

    it ('error on password mismatch on /login', done => {
      request
        .post('/login')
        .send({username: 'user1', password: 'wrong'})
        .end((err, res) => {
          const actual = JSON.parse(res.text);
          assert.equal(actual.status, 'error');
          assert.equal(actual.result, 'Forbidden');
          done();
        });
    });

    it ('error on bad username on /login', done => {
      request
        .post('/login')
        .send({username: 'not_a_user', password: 'test123'})
        .end((err, res) => {
          const actual = JSON.parse(res.text);
          assert.equal(actual.status, 'error');
          assert.equal(actual.result, 'Username Not Found');
          done();
        });
    });

  });

  describe('User', () => {

    it('Posts one user to users collection', done => {
      let myUserName = 'Johnny';
      let myPassword = '123';

      request
        .post('/users')
        .set('content-type', 'application/json')
        .set('token', token)
        .send({
          username: myUserName,
          password: myPassword
        })
        .end((err, res) => {
          let resObj = JSON.parse(res.text);

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

    it('Posts another user and gets three users', done => {
      let myUserName = 'Don';
      let myPassword = 'abc';

      request
        .post('/users')
        .set('content-type', 'application/json')
        .set('token', token)
        .send({
          username: myUserName,
          password: myPassword
        })
        .then(() => {
          request
            .get('/users')
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
        .get('/users')
        .set('content-type', 'application/json')
        .set('token', token)
        .then(res => {
          let resObj = JSON.parse(res.text);

          assert.equal(res.status, 200);
          assert.property(resObj, 'status');
          assert.property(resObj, 'result');
          assert.equal(resObj.status, 'success');
          assert.isArray(resObj.result);

          resObj.result.forEach(user => {
            assert.property(user, '_id');
            assert.property(user, 'username');
            assert.property(user, 'password');
            assert.property(user, 'createdAt');
            assert.property(user, 'updatedAt');
          });

          done();
        });
    });

    it('Throws specific validation error on name requirement', done => {
      let expected = 'Path `username` is required.';

      request
        .post('/users')
        .set('content-type', 'application/json')
        .set('token', token)
        .send({'password': 'secret123'})
        .end((err, res) => {
          let resObj = JSON.parse(res.text);

          assert.deepEqual(resObj.result, expected);

          done();
        });
    });

    it('Gets one user', done => {
      request
        .get('/users/johnny')
        .set('content-type', 'application/json')
        .set('token', token)
        .end((err, res) => {
          let resObj = JSON.parse(res.text);

          assert.equal(resObj.result.username, 'Johnny');

          done();
        });
    });

    it('Puts "jluangphasy" as new username for johnny', done => {
      request
        .put('/users/Johnny')
        .set('content-type', 'application/json')
        .set('token', token)
        .send({
          username: 'jluangphasy'
        })
        .then(() => {
          request
            .get('/users/jluangphasy')
            .set('content-type', 'application/json')
            .set('token', token)
            .end((err, res) => {
              let resObj = JSON.parse(res.text);

              assert.equal(resObj.result.username, 'jluangphasy');

              done();
            });
        });
    });

    it('Deletes one user, then all of the others', done => {
      request
        .del('/users/jluangphasy')
        .set('content-type', 'application/json')
        .set('token', token)
        .then(() => {
          request
            .del('/users/don')
            .set('content-type', 'application/json')
            .set('token', token)
            .then(() => {
              request
                .del(`/users/${user1.username}`)
                .set('content-type', 'application/json')
                .set('token', token)
                .then(() => {
                  request
                    .get('/users')
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

});
