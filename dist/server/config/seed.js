/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _apiUserUserModel = require('../api/user/user.model');

var _apiUserUserModel2 = _interopRequireDefault(_apiUserUserModel);

var debug = require('debug')('cmeasy:config:seed');

exports['default'] = function () {
  debug('Populating users');
  return _apiUserUserModel2['default'].find({}).removeAsync().then(function () {
    return _apiUserUserModel2['default'].createAsync({
      provider: 'local',
      name: 'Test User',
      email: 'test@test.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin'
    }).then(function (users) {
      debug('Finished populating users');
      return users;
    });
  });
};

module.exports = exports['default'];
//# sourceMappingURL=seed.js.map
