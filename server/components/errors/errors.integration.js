'use strict';


var cmeasy = require('../..');
import request from 'supertest';
import Promise from 'bluebird';
import uuid from 'uuid';
import _ from 'lodash';


/**
 *
 */
describe('Error API:', function() {

  this.timeout(10000);

  it('should get 404ed', function(done) {
    cmeasy.then(function(app) {
      request(app)
        .get('/assets/mooooo')
        .expect(404)
        .end((err, res) => {
          done();
        });
    });
  });

});


