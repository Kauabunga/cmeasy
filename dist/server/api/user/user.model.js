'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _mongoose = require('mongoose');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var R = require('ramda');

var UserSchema = new _mongoose.Schema({
  name: String,
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  role: {
    type: String,
    'default': 'user'
  },
  password: {
    type: String,
    required: true
  },
  provider: String,
  salt: String
});

/**
 * Virtuals
 */

// Public profile information
UserSchema.virtual('profile').get(function () {
  return {
    'name': this.name,
    'role': this.role
  };
});

// Non-sensitive info we'll be putting in the token
UserSchema.virtual('token').get(function () {
  return {
    '_id': this._id,
    'role': this.role
  };
});

/**
 * Validations
 */

// Validate empty email
UserSchema.path('email').validate(function (email) {
  return email.length;
}, 'Email cannot be blank');

// Validate empty password
UserSchema.path('password').validate(function (password) {
  return password.length;
}, 'Password cannot be blank');

// Validate email is not taken
UserSchema.path('email').validate(function (value, respond) {
  var self = this;
  return this.constructor.findOne({ email: value }).then(function (user) {
    if (user) {
      if (self.id === user.id) {
        return respond(true);
      }
      return respond(false);
    }
    return respond(true);
  })['catch'](function (err) {
    throw err;
  });
}, 'The specified email address is already in use.');

var validatePresenceOf = function validatePresenceOf(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema.pre('save', function (next) {
  var _this = this;

  var debug = require('debug')('cmeasy:user:preSave');
  if (!this.isModified('password')) {
    debug('Password has not been modified');
    return next();
  }

  if (!validatePresenceOf(this.password) && this.provider === 'local') {
    debug('No password present on user with provider = local');
    next(new Error('Invalid password'));
  }

  debug('Creating salt');
  this.makeSalt(function (saltErr, salt) {
    if (saltErr) {
      next(saltErr);
    }

    debug('Encrypting password');
    _this.salt = salt;
    _this.encryptPassword(_this.password, function (encryptErr, hashedPassword) {
      if (encryptErr) {
        next(encryptErr);
      }
      debug('Password encrypted');
      _this.password = hashedPassword;
      next();
    });
  });
});

/**
 * Methods
 */
UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @api public
   */
  authenticate: function authenticate(password, callback) {
    var _this2 = this;

    this.encryptPassword(password, function (err, pwdGen) {
      if (err) {
        return callback(err);
      }

      if (_this2.password === pwdGen) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    });
  },

  /**
   * Make salt
   *
   * @param {Number} byteSize Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt: function makeSalt(callback) {
    return _crypto2['default'].randomBytes(16, function (err, salt) {
      if (err) {
        return callback(err);
      }
      callback(null, salt.toString('base64'));
    });
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword: function encryptPassword(password, callback) {
    var debug = require('debug')('cmeasy:user:encryptPassword');
    if (!password || !this.salt) {
      debug('salt or password are missing, aborting');
      return null;
    }

    var defaultIterations = 10000;
    var defaultKeyLength = 64;
    var salt = new Buffer(this.salt, 'base64');

    debug('Encrypting');
    _crypto2['default'].pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha512', function (error, key) {
      debug('Encryption complete');
      if (error) {
        debug('Encryption error');
        return callback(error);
      }

      debug('Encrypted');
      callback(null, key.toString('base64'));
    });
  }
};

var User = undefined;
if (R.contains('User', mongoose.modelNames())) {
  User = mongoose.model('User');
} else {
  User = mongoose.model('User', UserSchema);
}

exports['default'] = User;
module.exports = exports['default'];
//# sourceMappingURL=user.model.js.map
