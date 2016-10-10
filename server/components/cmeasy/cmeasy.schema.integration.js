'use strict';

const cmeasy = require('../../app');
const options = require('../../options')();
const portfinder = require('portfinder');
import express from 'express';
import request from 'supertest';
import Promise from 'bluebird';
import _ from 'lodash';

describe('Cmeasy blogPost schema API:', function() {

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

  describe('GET /api/v1/content/schema/blogPost', function() {

    it('should get the blog post schema', function(done) {
      request(app)
        .get('/admin/api/v1/content/schema/blogPost')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {

          console.log('schema/blogPost', res.body);

          done();
        });
    });

  });

  describe('GET /api/v1/content/schema/blogPost/modelFormly', function() {

    it('should get the blog post formly model', function(done) {
      request(app)
        .get('/admin/api/v1/content/blogPost/modelFormly')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {

          console.log('blogPost/modelFormly', res.body);

          done();
        });
    });
  });

  describe('GET /api/v1/content/schema/blogPost/modelFormly', function() {

    before(addSchemaField('blogPost'));

    it('should update the blog post formly model', function(done) {
      request(app)
        .get('/admin/api/v1/content/blogPost/modelFormly')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {

          res.body.length.should.equal(4);

          //Should contain a 'newField' type
          res.body.should.contain({
            key: 'newField',
            templateOptions: {label: 'New Field', cssClass: ''},
            type: 'mdInput'
          });

          done();
        });
    });
  });


  /**
   * @param schemaType
   * @returns {Function}
   */
  function addSchemaField(schemaType) {
    const newField = {
      newField: {
        type: 'String',
        default: 'newField default',
        disableEdit: false
      }
    };

    return function() {
      return new Promise((success, failure) => {
        request(app)
          .get(`/admin/api/v1/content/schema/${schemaType}`)
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if (err) {
              return failure(err);
            }
            else {

              var updatedSchema = res.body;
              updatedSchema.definition = _.merge(res.body.definition, newField);

              request(app)
                .post(`/admin/api/v1/content/schema`)
                .send(updatedSchema)
                .expect(201)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                  if (err) {
                    return failure(err);
                  }
                  else {
                    success(res.body);
                  }
                });
            }
          });
      })
    }
  }
});

describe('Cmeasy meta schema API:', function() {

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

  // TODO should test/implement to ensure this cannot be changed
  describe('GET /api/v1/content/schema/CmeasyMetaSchema', function() {
    it('should get the meta schema', function(done) {
      request(app)
        .get('/admin/api/v1/content/schema/CmeasyMetaSchema')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          done();
        });
    });
  });

  describe('GET /api/v1/content/schema/CmeasyMetaSchema/modelFormly', function() {
    it('should get the meta schema formly definition', function(done) {
      request(app)
        .get('/admin/api/v1/content/schema/modelFormly')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {

          //TODO validate this response ....
          // console.log('CmeasyMetaSchema modelFormly');
          // console.log('CmeasyMetaSchema modelFormly');
          // console.log('CmeasyMetaSchema modelFormly');
          // console.log('CmeasyMetaSchema modelFormly');
          // console.log('CmeasyMetaSchema modelFormly', res.body);

          done();
        });
    });
  });
});
