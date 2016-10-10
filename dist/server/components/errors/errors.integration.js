'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var cmeasy = require('../../app');
var options = require('../../options')();
var portfinder = require('portfinder');

describe('Error API:', function () {

  this.timeout(10000);

  var app = undefined;
  before(function (done) {
    app = (0, _express2['default'])();
    options.express = app;

    portfinder.getPort(function (error, port) {
      if (error) {
        return done(error);
      }
      process.env.CMS_PORT = port;
      cmeasy(options).then(function () {
        done();
      });
    });
  });

  it('should get 404ed', function (done) {
    (0, _supertest2['default'])(app).get('/assets/mooooo').expect(404).end(function (err, res) {
      done();
    });
  });
});
//# sourceMappingURL=errors.integration.js.map
