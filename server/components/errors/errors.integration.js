'use strict';

const cmeasy = require('../../app');
const options = require('../../options')();
const portfinder = require('portfinder');
import express from 'express';
import request from 'supertest';

describe('Error API:', function() {

  this.timeout(10000);

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

  it('should get 404ed', function(done) {
    request(app)
      .get('/assets/mooooo')
      .expect(404)
      .end((err, res) => {
        done();
      });
  });

});


