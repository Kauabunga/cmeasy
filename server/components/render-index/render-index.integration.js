'use strict';


var cmeasy = require('../..');
import request from 'supertest';
import Promise from 'bluebird';
import uuid from 'uuid';
import _ from 'lodash';
import cheerio from 'cheerio';

/**
 *
 */
describe('Render index api:', function() {

  it('Should inject variables into the index.template.html', function(done) {
    cmeasy.then(function(app) {
      request(app)
        .get('/admin')
        .expect(200)
        .end((err, res) => {

          var $ = cheerio.load(res.text);

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


