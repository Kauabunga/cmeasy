'use strict';


var cmeasy = require('../..');
import request from 'supertest';
import Promise from 'bluebird';
import uuid from 'uuid';
import _ from 'lodash';


/**
 *
 */
describe('Cmeasy blogPost schema API:', function() {


  describe('GET /api/v1/content/schema/blogPost', function() {

    it('should get the blog post schema', function(done) {
      cmeasy.then(function(app) {
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

  });

  describe('GET /api/v1/content/schema/blogPost/modelFormly', function() {
    it('should get the blog post formly model', function(done) {
      cmeasy.then(function(app) {
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
  });

  describe('GET /api/v1/content/schema/blogPost/modelFormly', function() {

    before(addSchemaField('blogPost'));

    it('should update the blog post formly model', function(done) {
      cmeasy.then(function(app) {
        request(app)
          .get('/admin/api/v1/content/blogPost/modelFormly')
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {

            res.body.length.should.equal(3);

            //Should contain a 'newField' type
            res.body.should.contain({
              key: 'newField',
              templateOptions: { label: 'New Field', cssClass: '' },
              type: 'mdInput'
            });

            done();
          });
      });
    });
  });

});

/**
 *
 * @param schemaType
 * @returns {Function}
 */
function addSchemaField(schemaType){

  var newField = {
    newField: {
      type: 'String',
      default: 'newField default',
      disableEdit: false
    }
  };

  return function(){
    return cmeasy.then(function(app) {
      return new Promise((success, failure)=> {
        request(app)
          .get(`/admin/api/v1/content/schema/${schemaType}`)
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if(err){
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
                  if(err){
                    return failure(err);
                  }
                  else {
                    success(res.body);
                  }
                });
            }
          });
      });
    })
  }
}


/**
 *
 */
describe('Cmeasy meta schema API:', function() {

  describe('GET /api/v1/content/schema/CmeasyMetaSchema', function() {
    it('should get the meta schema', function(done) {
      cmeasy.then(function(app) {
        request(app)
          .get('/admin/api/v1/content/schema/CmeasyMetaSchema')
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            done();
          });
      });
    });
  });

  describe('GET /api/v1/content/schema/CmeasyMetaSchema/modelFormly', function() {
    it('should get the meta schema formly definition', function(done) {
      cmeasy.then(function(app) {
        request(app)
          .get('/admin/api/v1/content/schema/CmeasyMetaSchema/modelFormly')
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {

            console.log('CmeasyMetaSchema modelFormly', res.body);

            done();
          });
      });
    });
  });

});


