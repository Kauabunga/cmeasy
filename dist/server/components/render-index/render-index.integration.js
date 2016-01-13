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

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

/**
 *
 */
var cmeasy = require('../..');
describe('Render index api:', function () {

  //TODO need a test to handle the route /admin

  //TODO need a test to handle a different rootRoute

  //TODO need a test to ensure that the referenced resources are served correctly

  it('Should inject variables into the index.template.html', function (done) {
    cmeasy.then(function (app) {
      (0, _supertest2['default'])(app).get('/admin/').expect(200).end(function (err, res) {

        console.log('Render index api res.text:', res.text);

        var $ = _cheerio2['default'].load(res.text);

        var injectedVariablesScript = $('#cmeasyInjectedVariables');
        var injectedVariables = injectedVariablesScript.get(0).children[0].data;

        //Ensure there is only a single injected script
        injectedVariablesScript.length.should.equal(1);

        injectedVariables.indexOf('"env":"test"').should.not.equal(-1);

        //TODO smarter regex to test _cmeasyId":{ ..... blogPost ..... }
        injectedVariables.indexOf('"_cmeasyId":{"type":"String","default":"blogPost"').should.not.equal(-1);

        done();
      });
    });
  });
});
//# sourceMappingURL=render-index.integration.js.map
