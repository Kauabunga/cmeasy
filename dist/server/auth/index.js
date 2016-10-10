'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _apiUserUserModel = require('../api/user/user.model');

var _apiUserUserModel2 = _interopRequireDefault(_apiUserUserModel);

// Passport Configuration
require('./local/passport').setup(_apiUserUserModel2['default'], _config2['default']);

var router = _express2['default'].Router();

router.use('/local', require('./local'));

exports['default'] = router;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
