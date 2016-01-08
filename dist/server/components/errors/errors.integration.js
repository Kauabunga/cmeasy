'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

/**
 *
 */
var cmeasy = require('../..');
describe('Error API:', function () {

  this.timeout(10000);

  it('should get 404ed', function (done) {
    cmeasy.then(function (app) {
      (0, _supertest2['default'])(app).get('/assets/mooooo').expect(404).end(function (err, res) {
        done();
      });
    });
  });
});
//# sourceMappingURL=errors.integration.js.map
