'use strict';

const cmeasy = require('../../app');
const express = require('express');
const options = require('../../options')();
const portfinder = require('portfinder');
import request from 'supertest';
import Promise from 'bluebird';
import uuid from 'uuid';
import _ from 'lodash';

describe('Cmeasy blogPost model API:', function() {

  this.timeout(6000);

  let app;
  let blogPostItem;
  before(function(done) {
    app = express();
    options.express = app;

    portfinder.getPort(function(error, port) {
      if (error) {
        return done(error);
      }
      process.env.PORT = port;
      cmeasy(options)
        .then(function() {
          done();
        });
    });
  });

  describe('POST /api/v1/content/blogPost', function() {
    before(createDummyBlogPost);
    after(deleteDummyBlogPost);
    it('should create a blog post entry', function(done) {
      var newBlogPost = _.merge(blogPostItem, getDefaultBlogPost());
      request(app)
        .post('/admin/api/v1/content/blogPost')
        .send(newBlogPost)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          console.log(res.body);
          res.body.title.toString().should.equal(newBlogPost.title.toString());
          res.body.content.toString().should.equal(newBlogPost.content.toString());
          done();
        });
    });
  });


  describe('GET /api/v1/content/blogPost', function() {
    before(createDummyBlogPost);
    after(deleteDummyBlogPost);
    it('should get a blog post entry', function(done) {
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


  describe('GET /api/v1/content/blogPost', function() {
    before(() => {
      return createDummyBlogPost()
        .then(createDummyBlogPost)
        .then(createDummyBlogPost)
        .then(createDummyBlogPost)
        .then(createDummyBlogPost);
    });
    after(deleteAllDummyBlogPost);
    it('should get a all blog post entry', function(done) {
      request(app)
        .get('/admin/api/v1/content/blogPost')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          res.body.length.should.equal(5);
          done();
        });
    });
  });


  function createDummyBlogPost() {
    return new Promise((success) => {
      return request(app)
        .post('/admin/api/v1/content/blogPost')
        .send(getDefaultBlogPost())
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          console.log(res.statusCode);
          console.log(res.body);
          blogPostItem = res.body;
          success(res.body);
        });
    });
  }

  function deleteDummyBlogPost() {
    return new Promise((success) => {
      return request(app)
        .delete('/admin/api/v1/content/blogPost/' + blogPostItem._cmeasyInstanceId.toString())
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          success();
        });
    });
  }

  function deleteAllDummyBlogPost() {
    return new Promise((success) => {
      request(app)
        .get('/admin/api/v1/content/blogPost')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          return Promise.all(
            _(res.body).map((item) => {
              return new Promise((success, failure) => {
                request(app)
                  .delete('/admin/api/v1/content/blogPost/' + item._cmeasyInstanceId.toString())
                  .expect(200)
                  .expect('Content-Type', /json/)
                  .end((err, res) => {
                    if (err) {
                      failure();
                    }
                    else {
                      success(res.body);
                    }
                  });
              });
            }).value()
          ).then((res) => {
            return success(res);
          });

        })
    });
  }

  function getDefaultBlogPost() {
    return {
      title: 'Test blog title ' + uuid.v4(),
      content: 'Test blog content ' + uuid.v4()
    }
  }

  /**
   * Singleton item
   */
  describe('Cmeasy homePage model API:', function() {

    this.timeout(6000);

    let homePageItem;
    describe('POST /api/v1/content/homePage', function() {
      before(createDummyHomePage);
      after(deleteDummyHomePage);
      it('should create a home page entry', function(done) {
        var newHomePage = _.merge(homePageItem, getDefaultHomePage());
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

    describe('GET /api/v1/content/homePage', function() {
      before(createDummyHomePage);
      after(deleteDummyHomePage);
      it('should get a home page entry', function(done) {
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


    describe('GET /api/v1/content/homePage with multiple versions', function() {
      before(() => {
        return createDummyHomePage()
          .then(createDummyHomePage)
          .then(createDummyHomePage);
      });
      after(deleteDummyHomePage);
      it('should only get a single home page entry', function(done) {
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

    describe('GET /api/v1/content/homePage history with multiple versions', function() {
      before(() => {
        return createDummyHomePage()
          .then(createDummyHomePage)
          .then(createDummyHomePage)
          .then(createDummyHomePage);
      });
      after(deleteDummyHomePage);
      it('should only get a single home page entry', function(done) {
        request(app)
          .get('/admin/api/v1/content/homePage/homePage/history')
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            res.body.length.should.equal(4);
            done();
          });
      });
    });

    describe('GET /api/v1/content/homePage without prior instance', function() {
      after(deleteDummyHomePage);
      it('should get a home page entry', function(done) {
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

    function createDummyHomePage() {
      return new Promise((success) => {
        return request(app)
          .post('/admin/api/v1/content/homePage')
          .send(getDefaultHomePage())
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            homePageItem = res.body;
            success(res.body);
          });
      });
    }

    function deleteDummyHomePage() {
      return new Promise((success) => {
        return request(app)
          .delete('/admin/api/v1/content/homePage/' + homePageItem._cmeasyId.toString())
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            success();
          });
      });
    }

    function getDefaultHomePage() {
      return {
        title: 'Test home page title ' + uuid.v4()
      }
    }
  });
});
