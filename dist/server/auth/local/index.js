'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _authService = require('../auth.service');

var router = _express2['default'].Router();

router.post('/', function (req, res, next) {
  _passport2['default'].authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) {
      return res.status(401).json(error);
    }
    if (!user) {
      return res.status(404).json({ message: 'Something went wrong, please try again.' });
    }

    var token = (0, _authService.signToken)(user._id, user.role);
    res.json({ token: token });
  })(req, res, next);
});

exports['default'] = router;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
