'use strict';

const cmeasy = require('../../app');
const express = require('express');
import User from './user.model';
import request from 'supertest';

describe('User API:', function() {

  this.timeout(10000);

  let user;
  let adminUser;
  let app;
  before(function() {
    app = express();
    return User.removeAsync().then(function() {
      user = new User({
        name: 'Fake User',
        email: 'test@example.com',
        password: 'password'
      });
      return user.saveAsync()
        .then(function(savedUser) {
          user = savedUser.toObject();
        });
    })
      .then(function() {
        adminUser = new User({
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'password',
          role: 'admin'
        });
        return adminUser.saveAsync()
          .then(function(savedUser) {
            adminUser = savedUser.toObject();
          });
      })
      .then(function() {
        return cmeasy({
          express: app
        });
      });
  });

  // Clear users after testing
  after(function() {
    return User.removeAsync();
  });

  describe('GET /api/users', function() {

    let token;
    before(function(done) {
      request(app)
        .post('/admin/auth/local')
        .send({
          email: 'admin@example.com',
          password: 'password'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });

    it('should not get a list of users if they are not authenticated', function(done) {
      request(app)
        .get('/admin/api/v1/users')
        .expect(403)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          done();
        });
    });

    it('should get a list of all users', function(done) {
      request(app)
        .get('/admin/api/v1/users')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          res.body.length.should.equal(2);
          done();
        });
    });

    it('should get a single user', function(done) {
      request(app)
        .get('/admin/api/v1/users/' + user._id)
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          res.body.name.should.equal(user.name);
          done();
        });
    });

  });

  describe('POST /api/users', function() {

    var token;
    before(function(done) {
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

    it('should fail to create a user', function(done) {
      var createUser = {
        email: 'create@create.com'
      };
      request(app)
        .post('/admin/api/v1/users')
        .set('authorization', 'Bearer ' + token)
        .send(createUser)
        .expect(422)
        .expect('Content-Type', /json/)
        .end((err, res) => {

          console.log(res.statusCode);
          console.log(res.status);

          done();
        });
    });


    it('should fail to create a user with the same email', function(done) {
      var createUser = {
        email: 'test@example.com'
      };
      request(app)
        .post('/admin/api/v1/users')
        .set('authorization', 'Bearer ' + token)
        .send(createUser)
        .expect(422)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          done();
        });
    });

    //Note: this needs to run after the GET tests otherwise there will be an added user to the index test
    it('should create a user', function(done) {
      var createUser = {
        email: 'create@create.com',
        password: 'create'
      };
      request(app)
        .post('/admin/api/v1/users')
        .set('authorization', 'Bearer ' + token)
        .send(createUser)
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {

          res.body.token.should.not.equal(undefined);
          res.body.email.should.equal(createUser.email);

          done();
        });
    });

  });

  describe('DELETE /api/users', function() {

    var token;
    var deleteUser;

    before(function(done) {
      request(app)
        .post('/admin/auth/local')
        .send({
          email: 'admin@example.com',
          password: 'password'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          token = res.body.token;

          //Create a user to delete
          deleteUser = new User({
            name: 'Delete User',
            email: 'delete@delete.com',
            password: 'password'
          });

          return deleteUser.saveAsync()
            .then(function(savedUser) {
              deleteUser = savedUser.toObject();
              done();
            });

        });
    });

    it('should destroy a user', function(done) {
      request(app)
        .delete('/admin/api/v1/users/' + deleteUser._id)
        .set('authorization', 'Bearer ' + token)
        .expect(204)
        .expect('Content-Type', /json/)
        .end((err, res) => {

          console.log(res.body);

          done();
        });
    });

  });

  describe('GET /api/users/me', function() {

    var token;
    before(function(done) {
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

    it('should respond with a user profile when authenticated', function(done) {
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

    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .get('/admin/api/v1/users/me')
        .expect(401)
        .end(done);
    });
  });
});
