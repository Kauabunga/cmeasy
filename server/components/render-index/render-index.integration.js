'use strict';

const cmeasy = require('../../app');
const options = require('../../options')();
const portfinder = require('portfinder');
import express from 'express';
import request from 'supertest';
import cheerio from 'cheerio';

describe('Render index api:', function(done) {

  let app;
  before(function(done) {
    app = express();
    options.express = app;

    portfinder.getPort(function(error, port) {
      if (error) {
        return done(error);
      }
      process.env.CMS_PORT = port;
      cmeasy(options)
        .then(function() {
          done();
        });
    });
  });

  // TODO need a test to handle the route /admin
  // TODO need a test to handle a different rootRoute
  // TODO need a test to ensure that the referenced resources are served correctly
  it('Should inject variables into the index.template.html', function(done) {
    request(app)
      .get('/admin/')
      .expect(200)
      .end((err, res) => {

        console.log('Render index api res.text:', res.text);

        var $ = cheerio.load(res.text);

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


