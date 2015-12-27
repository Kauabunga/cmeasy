'use strict';


var cmeasy = require('../..');
import User from './user.model';
import request from 'supertest';


describe('User API:', function() {
  var user;

  // Clear users before testing
  before(function() {
    return User.removeAsync().then(function() {
      user = new User({
        name: 'Fake User',
        email: 'test@example.com',
        password: 'password'
      });

      return user.saveAsync();
    });
  });

  // Clear users after testing
  after(function() {
    return User.removeAsync();
  });

  describe('GET /api/users/me', function() {
    var token;

    before(function(done) {
      cmeasy.then(function(app){
        request(app)
          .post('/admin/auth/local')
          .send({
            email: 'test@example.com',
            password: 'password'
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            token = res.body.token;
            done();
          });
      });

    });

    it('should respond with a user profile when authenticated', function(done) {
      cmeasy.then(function(app) {
        request(app)
          .get('/admin/api/v1/users/me')
          .set('authorization', 'Bearer ' + token)
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            res.body._id.toString().should.equal(user._id.toString());
            done();
          });
      });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      cmeasy.then(function(app) {
        request(app)
          .get('/admin/api/v1/users/me')
          .expect(401)
          .end(done);
      });
    });
  });
});
