'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var app = require('../..');

var newGenerated;

/*
describe('Generated API:', function() {

  describe('GET /api/generated', function() {
    var generateds;

    beforeEach(function(done) {
      request(app)
        .get('/api/generated')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          generateds = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      generateds.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/generated', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/generated')
        .send({
          name: 'New Generated',
          info: 'This is the brand new generated!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newGenerated = res.body;
          done();
        });
    });

    it('should respond with the newly created generated', function() {
      newGenerated.name.should.equal('New Generated');
      newGenerated.info.should.equal('This is the brand new generated!!!');
    });

  });

  describe('GET /api/generated/:id', function() {
    var generated;

    beforeEach(function(done) {
      request(app)
        .get('/api/generated/' + newGenerated._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          generated = res.body;
          done();
        });
    });

    afterEach(function() {
      generated = {};
    });

    it('should respond with the requested generated', function() {
      generated.name.should.equal('New Generated');
      generated.info.should.equal('This is the brand new generated!!!');
    });

  });

  describe('PUT /api/generated/:id', function() {
    var updatedGenerated;

    beforeEach(function(done) {
      request(app)
        .put('/api/generated/' + newGenerated._id)
        .send({
          name: 'Updated Generated',
          info: 'This is the updated generated!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedGenerated = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedGenerated = {};
    });

    it('should respond with the updated generated', function() {
      updatedGenerated.name.should.equal('Updated Generated');
      updatedGenerated.info.should.equal('This is the updated generated!!!');
    });

  });

  describe('DELETE /api/generated/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/generated/' + newGenerated._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when generated does not exist', function(done) {
      request(app)
        .delete('/api/generated/' + newGenerated._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
*/
//# sourceMappingURL=generated.integration.js.map
