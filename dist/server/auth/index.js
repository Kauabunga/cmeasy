'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _configEnvironment = require('../config/environment');

var _configEnvironment2 = _interopRequireDefault(_configEnvironment);

var _apiUserUserModel = require('../api/user/user.model');

var _apiUserUserModel2 = _interopRequireDefault(_apiUserUserModel);

// Passport Configuration
require('./local/passport').setup(_apiUserUserModel2['default'], _configEnvironment2['default']);

var router = _express2['default'].Router();

router.use('/local', require('./local'));

exports['default'] = router;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
