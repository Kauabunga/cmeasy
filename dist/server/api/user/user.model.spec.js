'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _ = require('../..');

var _2 = _interopRequireDefault(_);

var _userModel = require('./user.model');

var _userModel2 = _interopRequireDefault(_userModel);

var user;
var genUser = function genUser() {
  user = new _userModel2['default']({
    provider: 'local',
    name: 'Fake User',
    email: 'test@example.com',
    password: 'password'
  });
  return user;
};

describe('User Model', function () {

  this.timeout(10000);

  before(function () {
    // Clear users before testing
    return _userModel2['default'].remove();
  });

  beforeEach(function () {
    genUser();
  });

  afterEach(function () {
    return _userModel2['default'].remove();
  });

  it('should begin with no users', function () {
    return _userModel2['default'].find({}).should.eventually.have.length(0);
  });

  it('should fail when saving a duplicate user', function () {
    return user.save().then(function () {
      var userDup = genUser();
      return userDup.save();
    }).should.be.rejected;
  });

  describe('#email', function () {
    it('should fail when saving without an email', function () {
      user.email = '';
      return user.save().should.be.rejected;
    });
  });

  describe('#password', function () {
    beforeEach(function () {
      return user.save();
    });

    it('should authenticate user if valid', function () {
      user.authenticate('password').should.be['true'];
    });

    it('should not authenticate user if invalid', function () {
      user.authenticate('blah').should.not.be['true'];
    });
  });
});
//# sourceMappingURL=user.model.spec.js.map
