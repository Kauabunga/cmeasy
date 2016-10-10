'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.index = index;
exports.create = create;
exports.show = show;
exports.destroy = destroy;
exports.changePassword = changePassword;
exports.me = me;
exports.authCallback = authCallback;

var _userModel = require('./user.model');

var _userModel2 = _interopRequireDefault(_userModel);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    console.error('User controller validation error', err);
    res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

function respondWith(res, statusCode) {
  statusCode = statusCode || 200;
  return function () {
    res.status(statusCode).end();
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */

function index(req, res) {
  return _userModel2['default'].find({}, '-salt -password').then(function (users) {
    res.status(200).json(users);
  })['catch'](handleError(res));
}

/**
 * Creates a new user
 */

function create(req, res, next) {

  var newUser = new _userModel2['default'](req.body);
  newUser.provider = 'local';
  newUser.role = 'user';

  return newUser.save().then(function (user) {
    var token = _jsonwebtoken2['default'].sign({ _id: user._id }, _config2['default'].secrets.session, {
      expiresIn: 60 * 60 * 5
    });
    return res.status(201).json({ token: token, email: user.email });
  })['catch'](validationError(res));
}

/**
 * Get a single user
 */

function show(req, res, next) {
  var userId = req.params.id;

  return _userModel2['default'].findById(userId).then(function (user) {
    if (!user) {
      return res.status(404).end();
    }
    return res.json(user.profile);
  })['catch'](function (err) {
    return next(err);
  });
}

/**
 * Deletes a user
 * restriction: 'admin'
 */

function destroy(req, res) {
  return _userModel2['default'].findByIdAndRemove(req.params.id).then(function () {
    res.status(204).end();
  })['catch'](handleError(res));
}

/**
 * Change a users password
 */

function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return _userModel2['default'].findById(userId).then(function (user) {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      return user.save().then(function () {
        return res.status(204).end();
      })['catch'](validationError(res));
    } else {
      return res.status(403).end();
    }
  });
}

/**
 * Get my info
 */

function me(req, res, next) {
  var userId = req.user._id;

  return _userModel2['default'].findOne({ _id: userId }, '-salt -password').then(function (user) {
    // don't ever give out the password or salt
    if (!user) {
      return res.status(401).end();
    } else {
      return res.json(user);
    }
  })['catch'](function (err) {
    return next(err);
  });
}

/**
 * Authentication callback
 */

function authCallback(req, res, next) {
  return res.redirect('/');
}
//# sourceMappingURL=user.controller.js.map
