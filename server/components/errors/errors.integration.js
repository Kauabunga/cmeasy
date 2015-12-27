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

  it('should get 404ed', function(done) {
    cmeasy.then(function(app) {
      request(app)
        .get('/admin/api/v1/abc')
        .expect(404)
        .end((err, res) => {
          done();
        });
    });
  });

});


