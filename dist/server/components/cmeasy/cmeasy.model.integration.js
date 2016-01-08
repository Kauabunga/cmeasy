'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

/**
 *
 */
var cmeasy = require('../..');
describe('Cmeasy blogPost model API:', function () {

  var blogPostItem;
  this.timeout(6000);

  describe('POST /api/v1/content/blogPost', function () {
    before(createDummyBlogPost);
    after(deleteDummyBlogPost);
    it('should create a blog post entry', function (done) {
      var newBlogPost = _lodash2['default'].merge(blogPostItem, getDefaultBlogPost());
      cmeasy.then(function (app) {
        (0, _supertest2['default'])(app).post('/admin/api/v1/content/blogPost').send(newBlogPost).expect(200).expect('Content-Type', /json/).end(function (err, res) {
          res.body.title.toString().should.equal(newBlogPost.title.toString());
          res.body.content.toString().should.equal(newBlogPost.content.toString());
          done();
        });
      });
    });
  });

  describe('GET /api/v1/content/blogPost', function () {
    before(createDummyBlogPost);
    after(deleteDummyBlogPost);
    it('should get a blog post entry', function (done) {
      cmeasy.then(function (app) {
        (0, _supertest2['default'])(app).get('/admin/api/v1/content/blogPost/' + blogPostItem._cmeasyInstanceId.toString()).expect(200).expect('Content-Type', /json/).end(function (err, res) {
          res.body.title.toString().should.equal(blogPostItem.title.toString());
          res.body.content.toString().should.equal(blogPostItem.content.toString());
          done();
        });
      });
    });
  });

  describe('GET /api/v1/content/blogPost', function () {
    before(function () {
      return createDummyBlogPost().then(createDummyBlogPost).then(createDummyBlogPost).then(createDummyBlogPost).then(createDummyBlogPost);
    });
    after(deleteAllDummyBlogPost);
    it('should get a all blog post entry', function (done) {
      cmeasy.then(function (app) {
        (0, _supertest2['default'])(app).get('/admin/api/v1/content/blogPost').expect(200).expect('Content-Type', /json/).end(function (err, res) {
          res.body.length.should.equal(5);
          done();
        });
      });
    });
  });

  /**
   *
   * @returns {*}
   */
  function createDummyBlogPost() {
    return cmeasy.then(function (app) {
      return new _bluebird2['default'](function (success) {
        return (0, _supertest2['default'])(app).post('/admin/api/v1/content/blogPost').send(getDefaultBlogPost()).expect(200).expect('Content-Type', /json/).end(function (err, res) {
          blogPostItem = res.body;
          success(res.body);
        });
      });
    });
  }

  /**
   *
   * @returns {*}
   */
  function deleteDummyBlogPost() {
    return cmeasy.then(function (app) {
      return new _bluebird2['default'](function (success) {
        return (0, _supertest2['default'])(app)['delete']('/admin/api/v1/content/blogPost/' + blogPostItem._cmeasyInstanceId.toString()).expect(200).expect('Content-Type', /json/).end(function (err, res) {
          success();
        });
      });
    });
  }

  /**
   *
   * @returns {*}
   */
  function deleteAllDummyBlogPost() {
    return cmeasy.then(function (app) {
      return new _bluebird2['default'](function (success) {
        (0, _supertest2['default'])(app).get('/admin/api/v1/content/blogPost').expect(200).expect('Content-Type', /json/).end(function (err, res) {
          return _bluebird2['default'].all((0, _lodash2['default'])(res.body).map(function (item) {
            return new _bluebird2['default'](function (success, failure) {
              (0, _supertest2['default'])(app)['delete']('/admin/api/v1/content/blogPost/' + item._cmeasyInstanceId.toString()).expect(200).expect('Content-Type', /json/).end(function (err, res) {
                if (err) {
                  failure();
                } else {
                  success(res.body);
                }
              });
            });
          }).value()).then(function (res) {
            return success(res);
          });
        });
      });
    });
  }

  /**
   *
   * @returns {{title: string, content: string}}
   */
  function getDefaultBlogPost() {
    return {
      title: 'Test blog title ' + _uuid2['default'].v4(),
      content: 'Test blog content ' + _uuid2['default'].v4()
    };
  }
});

/**
 *
 * Singleton item
 *
 */
describe('Cmeasy homePage model API:', function () {

  var homePageItem;

  this.timeout(6000);

  describe('POST /api/v1/content/homePage', function () {
    before(createDummyHomePage);
    after(deleteDummyHomePage);
    it('should create a home page entry', function (done) {
      var newHomePage = _lodash2['default'].merge(homePageItem, getDefaultHomePage());
      cmeasy.then(function (app) {
        (0, _supertest2['default'])(app).post('/admin/api/v1/content/homePage').send(newHomePage).expect(200).expect('Content-Type', /json/).end(function (err, res) {
          res.body.title.toString().should.equal(newHomePage.title.toString());
          done();
        });
      });
    });
  });

  describe('GET /api/v1/content/homePage', function () {
    before(createDummyHomePage);
    after(deleteDummyHomePage);
    it('should get a home page entry', function (done) {
      cmeasy.then(function (app) {
        (0, _supertest2['default'])(app).get('/admin/api/v1/content/homePage/' + homePageItem._cmeasyId.toString()).expect(200).expect('Content-Type', /json/).end(function (err, res) {
          res.body.title.toString().should.equal(homePageItem.title.toString());
          done();
        });
      });
    });
  });

  describe('GET /api/v1/content/homePage with multiple versions', function () {
    before(function () {
      return createDummyHomePage().then(createDummyHomePage).then(createDummyHomePage);
    });
    after(deleteDummyHomePage);
    it('should only get a single home page entry', function (done) {
      cmeasy.then(function (app) {
        (0, _supertest2['default'])(app).get('/admin/api/v1/content/homePage').expect(200).expect('Content-Type', /json/).end(function (err, res) {
          res.body.length.should.equal(1);
          done();
        });
      });
    });
  });

  describe('GET /api/v1/content/homePage history with multiple versions', function () {
    before(function () {
      return createDummyHomePage().then(createDummyHomePage).then(createDummyHomePage).then(createDummyHomePage);
    });
    after(deleteDummyHomePage);
    it('should only get a single home page entry', function (done) {
      cmeasy.then(function (app) {
        (0, _supertest2['default'])(app).get('/admin/api/v1/content/homePage/homePage/history').expect(200).expect('Content-Type', /json/).end(function (err, res) {
          res.body.length.should.equal(4);
          done();
        });
      });
    });
  });

  describe('GET /api/v1/content/homePage without prior instance', function () {
    after(deleteDummyHomePage);
    it('should get a home page entry', function (done) {
      cmeasy.then(function (app) {
        (0, _supertest2['default'])(app).get('/admin/api/v1/content/homePage/' + 'homePage').expect(200).expect('Content-Type', /json/).end(function (err, res) {
          res.body.title.toString().should.equal('Default Home Page Title');
          done();
        });
      });
    });
  });

  /**
   *
   * @returns {*}
   */
  function createDummyHomePage() {
    return cmeasy.then(function (app) {
      return new _bluebird2['default'](function (success) {
        return (0, _supertest2['default'])(app).post('/admin/api/v1/content/homePage').send(getDefaultHomePage()).expect(200).expect('Content-Type', /json/).end(function (err, res) {
          homePageItem = res.body;
          success(res.body);
        });
      });
    });
  }

  /**
   *
   * @returns {*}
   */
  function deleteDummyHomePage() {
    return cmeasy.then(function (app) {
      return new _bluebird2['default'](function (success) {
        return (0, _supertest2['default'])(app)['delete']('/admin/api/v1/content/homePage/' + homePageItem._cmeasyId.toString()).expect(200).expect('Content-Type', /json/).end(function (err, res) {
          success();
        });
      });
    });
  }

  /**
   *
   * @returns {{title: string, content: string}}
   */
  function getDefaultHomePage() {
    return {
      title: 'Test home page title ' + _uuid2['default'].v4()
    };
  }
});
//# sourceMappingURL=cmeasy.model.integration.js.map