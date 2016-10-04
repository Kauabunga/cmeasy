'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var cmeasy = require('../../app');
var options = require('../../options')();
var portfinder = require('portfinder');

describe('Render index api:', function (done) {

  var app = undefined;
  before(function (done) {
    app = (0, _express2['default'])();
    options.express = app;

    portfinder.getPort(function (error, port) {
      if (error) {
        return done(error);
      }
      process.env.PORT = port;
      cmeasy(options).then(function () {
        done();
      });
    });
  });

  // TODO need a test to handle the route /admin
  // TODO need a test to handle a different rootRoute
  // TODO need a test to ensure that the referenced resources are served correctly
  it('Should inject variables into the index.template.html', function (done) {
    (0, _supertest2['default'])(app).get('/admin/').expect(200).end(function (err, res) {

      console.log('Render index api res.text:', res.text);

      var $ = _cheerio2['default'].load(res.text);

      var injectedVariablesScript = $('#cmeasyInjectedVariables');
      var injectedVariables = injectedVariablesScript.get(0).children[0].data;

      //Ensure there is only a single injected script
      injectedVariablesScript.length.should.equal(1);

      injectedVariables.indexOf('"env":"test"').should.not.equal(-1);

      // TODO smarter regex to test _cmeasyId":{ ..... blogPost ..... }
      injectedVariables.indexOf('"_cmeasyId":{"type":"String","default":"blogPost"').should.not.equal(-1);

      done();
    });
  });
});
//# sourceMappingURL=render-index.integration.js.map
