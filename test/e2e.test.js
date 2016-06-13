const chai = require('chai');
const chaiHttp = require('chai-http');
const database = require('../lib/database');
const app = require('../lib/app');
const User = require('../models/user.model');
const mongoose = require('mongoose');

const assert = chai.assert;
// const db = mongoose.connect('mongodb://localhost/give-and-take');
const dbConnection = database.connect('mongodb://localhost/give-and-take');

chai.use(chaiHttp);

describe('End to End Testing', () => {
  let request = chai.request(app);
  let user1 = {'username': 'User1', 'password': 'test123', 'skills': 'piano', 'topic': 'music'};

  function parse(str) {
    return JSON.parse(str);
  }

  before(done => {
    dbConnection.on('open', () => {
      User
        .remove({})
        .then(() => {
          done();
        });
    });
  });

  // describe('Authentication', () => {
    
    // it ('registers new user on /register', done => {
    //   request
    //     .post('/api/auth/register')
    //     .set('Content-Type', 'application/json')
    //     .send(user1)
    //     .end((err, res) => {

    //       done();
    //       const actual = parse(res.text);
    //       assert.property(actual.result, 'userId');
    //       assert.property(actual.result, 'token');
    //       id = actual.result.userId;
    //       id = id.replace(/^"(.*)"$/, '$1');
    //       assert.equal(id, 'whomp');
    //     });
    // });
    
  it('Retrieves all Subtopics', done => {
    request
      .get('/api/subtopics')
      .then(r => {
        // const res = parse(r);
        assert.equal(r, 'fuck');
        done();
      })
  });
    
    // it('deletes new user on /register', done => {
    //   console.log(`/api/users/${id}`);
    //   request
    //     .del('/api/users/575e08ae9df8d6401a8940b1')
    //     .set({'token': '575e08ae9df8d6401a8940b1'})
    //     .end((err, res) => {
    //       const actual = parse(res.text);
    //       assert.deepEqual(actual.error.message, 'success');
    //       done();
    //     });
    // });
    
  
    
    

  //   it ('error on duplicate username input on /register', done => {
  //     const expected = 'Username: user1 already exists';
  //     request
  //       .post('/api/auth/register')
  //       .send(user1)
  //       .end((err, res) => {
  //         const actual = JSON.parse(res.text);
  //         assert.equal(actual.status, 'error');
  //         assert.equal(actual.result, expected);
  //         done();
  //       });
  //   });

  //   it ('user success on /login', done => {
  //     request
  //       .post('/api/auth/login')
  //       .send(user1)
  //       .end((err, res) => {
  //         const actual = JSON.parse(res.text);
  //         assert.equal(actual.status, 'success');
  //         done();
  //       });
  //   });

  //   it ('error on password mismatch on /login', done => {
  //     request
  //       .post('/api/auth/login')
  //       .send({username: 'user1', password: 'wrong'})
  //       .end((err, res) => {
  //         const actual = JSON.parse(res.text);
  //         assert.equal(actual.status, 'error');
  //         assert.equal(actual.result, 'Forbidden');
  //         done();
  //       });
  //   });

  //   it ('error on bad username on /login', done => {
  //     request
  //       .post('/api/auth/login')
  //       .send({username: 'not_a_user', password: 'test123'})
  //       .end((err, res) => {
  //         const actual = JSON.parse(res.text);
  //         assert.equal(actual.status, 'error');
  //         assert.equal(actual.result, 'Username Not Found');
  //         done();
  //       });
  //   });

  });

  // describe('User', () => {

  //   it('Posts one user to users collection', done => {
  //     let myUserName = 'Johnny';
  //     let myPassword = '123';

  //     request
  //       .post('/api/users')
  //       .set('content-type', 'application/json')
  //       .set('token', token)
  //       .send({
  //         username: myUserName,
  //         password: myPassword
  //       })
  //       .end((err, res) => {
  //         let resObj = JSON.parse(res.text);

  //         assert.equal(res.status, 200);
  //         assert.property(resObj, 'status');
  //         assert.equal(resObj.status, 'posted');
  //         assert.property(resObj, 'result');
  //         assert.isObject(resObj.result);
  //         assert.property(resObj.result, '_id');
  //         assert.property(resObj.result, 'username');
  //         assert.equal(resObj.result.username, myUserName);
  //         assert.property(resObj.result, 'password');
  //         assert.property(resObj.result, 'createdAt');
  //         assert.property(resObj.result, 'updatedAt');

  //         done();
  //       });
  //   });

  //   it('Posts another user and gets three users', done => {
  //     let myUserName = 'Don';
  //     let myPassword = 'abc';

  //     request
  //       .post('/api/users')
  //       .set('content-type', 'application/json')
  //       .set('token', token)
  //       .send({
  //         username: myUserName,
  //         password: myPassword
  //       })
  //       .then(() => {
  //         request
  //           .get('/api/users')
  //           .set('content-type', 'application/json')
  //           .set('token', token)
  //           .end((err, res) => {
  //             let resObj = JSON.parse(res.text);

  //             assert.equal(resObj.result.length, 3);

  //             done();
  //           });
  //       });
  //   });

  //   it('Gets all users', done => {
  //     request
  //       .get('/api/users')
  //       .set('content-type', 'application/json')
  //       .set('token', token)
  //       .then(res => {
  //         let resObj = JSON.parse(res.text);

  //         assert.equal(res.status, 200);
  //         assert.property(resObj, 'status');
  //         assert.property(resObj, 'result');
  //         assert.equal(resObj.status, 'success');
  //         assert.isArray(resObj.result);

  //         resObj.result.forEach(user => {
  //           assert.property(user, '_id');
  //           assert.property(user, 'username');
  //           assert.property(user, 'password');
  //           assert.property(user, 'createdAt');
  //           assert.property(user, 'updatedAt');
  //         });

  //         done();
  //       });
  //   });

  //   it('Throws specific validation error on name requirement', done => {
  //     let expected = 'User Creation Failed';

  //     request
  //       .post('/api/users')
  //       .set('content-type', 'application/json')
  //       .set('token', token)
  //       .send({'password': 'secret123'})
  //       .end((err, res) => {
  //         let resObj = JSON.parse(res.text);

  //         assert.equal(resObj.result, expected);

  //         done();
  //       });
  //   });

  //   it('Gets one user', done => {
  //     request
  //       .get('/api/users/johnny')
  //       .set('content-type', 'application/json')
  //       .set('token', token)
  //       .end((err, res) => {
  //         let resObj = JSON.parse(res.text);

  //         assert.equal(resObj.result.username, 'Johnny');

  //         done();
  //       });
  //   });

  //   it('Puts "jluangphasy" as new username for johnny', done => {
  //     request
  //       .put('/api/users/Johnny')
  //       .set('content-type', 'application/json')
  //       .set('token', token)
  //       .send({
  //         username: 'jluangphasy'
  //       })
  //       .then(() => {
  //         request
  //           .get('/api/users/jluangphasy')
  //           .set('content-type', 'application/json')
  //           .set('token', token)
  //           .end((err, res) => {
  //             let resObj = JSON.parse(res.text);

  //             assert.equal(resObj.result.username, 'jluangphasy');

  //             done();
  //           });
  //       });
  //   });

  //   it('Deletes one user, then all of the others', done => {
  //     request
  //       .del('/api/users/jluangphasy')
  //       .set('content-type', 'application/json')
  //       .set('token', token)
  //       .then(() => {
  //         request
  //           .del('/api/users/don')
  //           .set('content-type', 'application/json')
  //           .set('token', token)
  //           .then(() => {
  //             request
  //               .del(`/api/users/${user1.username}`)
  //               .set('content-type', 'application/json')
  //               .set('token', token)
  //               .then(() => {
  //                 request
  //                   .get('/api/users')
  //                   .set('content-type', 'application/json')
  //                   .set('token', token)
  //                   .end((err, res) => {
  //                     let resObj = JSON.parse(res.text);

  //                     assert.equal(resObj.result, 'There are no users yet. Post here to start adding some.');

  //                     done();
  //                   });
  //               });
  //           });
  //       });
  //   });

  // });

  // after(done => {
  //   db.disconnect();

  //   done();
  // });

// });
