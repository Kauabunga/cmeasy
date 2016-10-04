'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _mongoose = require('mongoose');

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

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
  return this.constructor.findOneAsync({ email: value }).then(function (user) {
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

  // Handle new/update passwords
  if (!this.isModified('password')) {
    return next();
  }

  if (!validatePresenceOf(this.password) && this.provider === 'local') {
    next(new Error('Invalid password'));
  }

  // Make salt with a callback
  this.makeSalt(function (saltErr, salt) {
    if (saltErr) {
      next(saltErr);
    }
    _this.salt = salt;
    _this.encryptPassword(_this.password, function (encryptErr, hashedPassword) {
      if (encryptErr) {
        next(encryptErr);
      }
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
   * @return {Boolean}
   * @api public
   */
  authenticate: function authenticate(password, callback) {
    var _this2 = this;

    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

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
  makeSalt: function makeSalt(byteSize, callback) {
    var defaultByteSize = 16;

    if (typeof arguments[0] === 'function') {
      callback = arguments[0];
      byteSize = defaultByteSize;
    } else if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    if (!callback) {
      return _crypto2['default'].randomBytes(byteSize).toString('base64');
    }

    return _crypto2['default'].randomBytes(byteSize, function (err, salt) {
      if (err) {
        callback(err);
      } else {
        callback(null, salt.toString('base64'));
      }
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
    if (!password || !this.salt) {
      return null;
    }

    var defaultIterations = 10000;
    var defaultKeyLength = 64;
    var salt = new Buffer(this.salt, 'base64');

    if (!callback) {
      return _crypto2['default'].pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha1').toString('base64');
    }

    return _crypto2['default'].pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha1', function (error, key) {
      if (error) {
        return callback(error);
      }

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
