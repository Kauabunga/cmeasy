'use strict';


var cmeasy = require('../..');
import request from 'supertest';
import Promise from 'bluebird';
import uuid from 'uuid';
import _ from 'lodash';


/**
 *
 */
describe('Cmeasy blogPost model API:', function() {

  var blogPostItem;


  describe('POST /api/v1/content/blogPost', function() {
    before(createDummyBlogPost);
    after(deleteDummyBlogPost);
    it('should create a blog post entry', function(done) {
      var newBlogPost = _.merge(blogPostItem, getDefaultBlogPost());
      cmeasy.then(function(app) {
        request(app)
          .post('/admin/api/v1/content/blogPost')
          .send(newBlogPost)
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            res.body.title.toString().should.equal(newBlogPost.title.toString());
            res.body.content.toString().should.equal(newBlogPost.content.toString());
            done();
          });
      });
    });
  });



  describe('GET /api/v1/content/blogPost', function() {
    before(createDummyBlogPost);
    after(deleteDummyBlogPost);
    it('should get a blog post entry', function(done) {
      cmeasy.then(function(app) {
        request(app)
          .get('/admin/api/v1/content/blogPost/' + blogPostItem._cmeasyInstanceId.toString())
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            res.body.title.toString().should.equal(blogPostItem.title.toString());
            res.body.content.toString().should.equal(blogPostItem.content.toString());
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
    return cmeasy.then(function(app) {
      return new Promise((success)=>{
        return request(app)
          .post('/admin/api/v1/content/blogPost')
          .send(getDefaultBlogPost())
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            blogPostItem = res.body;
            success(res.body);
          });
      })
    });
  }

  /**
   *
   * @returns {*}
   */
  function deleteDummyBlogPost(){
    return cmeasy.then(function(app) {
      return new Promise((success)=>{
        return request(app)
          .delete('/admin/api/v1/content/blogPost/' + blogPostItem._cmeasyInstanceId.toString())
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            success();
          });
      })
    });
  }

  /**
   *
   * @returns {{title: string, content: string}}
   */
  function getDefaultBlogPost(){
    return {
      title: 'Test blog title ' + uuid.v4(),
        content: 'Test blog content ' + uuid.v4()
    }
  }


});



/**
 *
 * Singleton item
 *
 */
describe('Cmeasy homePage model API:', function() {

  var homePageItem;

  describe('POST /api/v1/content/homePage', function() {
    before(createDummyHomePage);
    after(deleteDummyHomePage);
    it('should create a home page entry', function(done) {
      var newHomePage = _.merge(homePageItem, getDefaultHomePage());
      cmeasy.then(function(app) {
        request(app)
          .post('/admin/api/v1/content/homePage')
          .send(newHomePage)
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            res.body.title.toString().should.equal(newHomePage.title.toString());
            done();
          });
      });
    });
  });


  describe('GET /api/v1/content/homePage', function() {
    before(createDummyHomePage);
    after(deleteDummyHomePage);
    it('should get a home page entry', function(done) {
      cmeasy.then(function(app) {
        request(app)
          .get('/admin/api/v1/content/homePage/' + homePageItem._cmeasyId.toString())
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            res.body.title.toString().should.equal(homePageItem.title.toString());
            done();
          });
      });
    });
  });


  describe('GET /api/v1/content/homePage with multiple versions', function() {
    before(() => {
      return createDummyHomePage()
        .then(createDummyHomePage)
        .then(createDummyHomePage);
    });
    after(deleteDummyHomePage);
    it('should only get a single home page entry', function(done) {
      cmeasy.then(function(app) {
        request(app)
          .get('/admin/api/v1/content/homePage')
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            res.body.length.should.equal(1);
            done();
          });
      });
    });
  });

  describe('GET /api/v1/content/homePage history with multiple versions', function() {
    before(() => {
      return createDummyHomePage()
        .then(createDummyHomePage)
        .then(createDummyHomePage);
    });
    after(deleteDummyHomePage);
    it('should only get a single home page entry', function(done) {
      cmeasy.then(function(app) {
        request(app)
          .get('/admin/api/v1/content/homePage/homePage/history')
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            res.body.length.should.equal(3);
            done();
          });
      });
    });
  });

  describe('GET /api/v1/content/homePage without prior instance', function() {
    after(deleteDummyHomePage);
    it('should get a home page entry', function(done) {
      cmeasy.then(function(app) {
        request(app)
          .get('/admin/api/v1/content/homePage/' + 'homePage')
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
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
    return cmeasy.then(function(app) {
      return new Promise((success)=>{
        return request(app)
          .post('/admin/api/v1/content/homePage')
          .send(getDefaultHomePage())
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            homePageItem = res.body;
            success(res.body);
          });
      })
    });
  }

  /**
   *
   * @returns {*}
   */
  function deleteDummyHomePage(){
    return cmeasy.then(function(app) {
      return new Promise((success)=>{
        return request(app)
          .delete('/admin/api/v1/content/homePage/' + homePageItem._cmeasyId.toString())
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            success();
          });
      })
    });
  }

  /**
   *
   * @returns {{title: string, content: string}}
   */
  function getDefaultHomePage(){
    return {
      title: 'Test home page title ' + uuid.v4(),
    }
  }


});