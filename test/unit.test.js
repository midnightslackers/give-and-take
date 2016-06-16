const chai = require('chai');
const User = require('../models/user.model');

const assert = chai.assert;

describe('Unit Testing', () => {

  // What about Topic and Subtopic testing???
  
  describe('User Model', () => {

    it('Validates required username field', done => {
      let noUser = new User({
        password: 'abc123'
      });
      let expected = 'Path `username` is required.';

      noUser.validate(err => {
        let message = err.errors.username.message;

        assert.equal(message, expected);

        done();
      });
    });

    it('Validates required password field', done => {
      let noPass = new User({
        username: 'user123'
      });
      let expected = 'Path `password` is required.';

      noPass.validate(err => {
        let message = err.errors.password.message;

        assert.equal(message, expected);

        done();
      });
    });

  });

});
