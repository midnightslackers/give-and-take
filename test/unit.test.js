const chai = require('chai');
const User = require('../models/user.model');

const assert = chai.assert;

describe('Unit Testing', () => {

  describe('User Model', () => {

    it('Validates required username field', done => {
      var noUser = new User({password: 'abc123'});
      var expected = 'Path `username` is required.';
      noUser.validate((err) => {
        var message = err.errors.username.message;
        assert.equal(message, expected);
        done();
      });
    });

    it('Validates required password field', done => {
      var noPass = new User({username: 'user123'});
      var expected = 'Path `password` is required.';
      noPass.validate((err) => {
        var message = err.errors.password.message;
        assert.equal(message, expected);
        done();
      });
    });

  });

});
