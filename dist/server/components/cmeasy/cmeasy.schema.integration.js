'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var cmeasy = require('../../app');
var options = require('../../options')();
var portfinder = require('portfinder');

describe('Cmeasy blogPost schema API:', function () {

  var app = undefined;
  before(function (done) {
    app = (0, _express2['default'])();
    options.express = app;

    portfinder.getPort(function (error, port) {
      if (error) {
        return done(error);
      }
      process.env.CMS_PORT = port;
      cmeasy(options).then(function () {
        done();
      });
    });
  });

  describe('GET /api/v1/content/schema/blogPost', function () {

    it('should get the blog post schema', function (done) {
      (0, _supertest2['default'])(app).get('/admin/api/v1/content/schema/blogPost').expect(200).expect('Content-Type', /json/).end(function (err, res) {

        console.log('schema/blogPost', res.body);

        done();
      });
    });
  });

  describe('GET /api/v1/content/schema/blogPost/modelFormly', function () {

    it('should get the blog post formly model', function (done) {
      (0, _supertest2['default'])(app).get('/admin/api/v1/content/blogPost/modelFormly').expect(200).expect('Content-Type', /json/).end(function (err, res) {

        console.log('blogPost/modelFormly', res.body);

        done();
      });
    });
  });

  describe('GET /api/v1/content/schema/blogPost/modelFormly', function () {

    before(addSchemaField('blogPost'));

    it('should update the blog post formly model', function (done) {
      (0, _supertest2['default'])(app).get('/admin/api/v1/content/blogPost/modelFormly').expect(200).expect('Content-Type', /json/).end(function (err, res) {

        res.body.length.should.equal(4);

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

  /**
   * @param schemaType
   * @returns {Function}
   */
  function addSchemaField(schemaType) {
    var newField = {
      newField: {
        type: 'String',
        'default': 'newField default',
        disableEdit: false
      }
    };

    return function () {
      return new _bluebird2['default'](function (success, failure) {
        (0, _supertest2['default'])(app).get('/admin/api/v1/content/schema/' + schemaType).expect(200).expect('Content-Type', /json/).end(function (err, res) {
          if (err) {
            return failure(err);
          } else {

            var updatedSchema = res.body;
            updatedSchema.definition = _lodash2['default'].merge(res.body.definition, newField);

            (0, _supertest2['default'])(app).post('/admin/api/v1/content/schema').send(updatedSchema).expect(201).expect('Content-Type', /json/).end(function (err, res) {
              if (err) {
                return failure(err);
              } else {
                success(res.body);
              }
            });
          }
        });
      });
    };
  }
});

describe('Cmeasy meta schema API:', function () {

  var app = undefined;
  before(function (done) {
    app = (0, _express2['default'])();
    options.express = app;

    portfinder.getPort(function (error, port) {
      if (error) {
        return done(error);
      }
      process.env.CMS_PORT = port;
      cmeasy(options).then(function () {
        done();
      });
    });
  });

  // TODO should test/implement to ensure this cannot be changed
  describe('GET /api/v1/content/schema/CmeasyMetaSchema', function () {
    it('should get the meta schema', function (done) {
      (0, _supertest2['default'])(app).get('/admin/api/v1/content/schema/CmeasyMetaSchema').expect(200).expect('Content-Type', /json/).end(function (err, res) {
        done();
      });
    });
  });

  describe('GET /api/v1/content/schema/CmeasyMetaSchema/modelFormly', function () {
    it('should get the meta schema formly definition', function (done) {
      (0, _supertest2['default'])(app).get('/admin/api/v1/content/schema/modelFormly').expect(200).expect('Content-Type', /json/).end(function (err, res) {

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
//# sourceMappingURL=cmeasy.schema.integration.js.map
