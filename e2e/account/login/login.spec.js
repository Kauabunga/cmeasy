'use strict';

var config = browser.params;
var UserModel = require(config.serverConfig.root + '/server/api/user/user.model');

describe('Login View', function() {
  var page;

  var loadPage = function() {
    let promise = browser.get(config.baseUrl + '/login');
    page = require('./login.po');
    return promise;
  };

  var testUser = {
    name: 'Test User',
    email: 'admin@admin.com',
    password: 'admin'
  };

  before(function() {
    return UserModel
      .removeAsync()
      .then(function() {
        return UserModel.createAsync(testUser);
      })
      .then(loadPage);
  });

  after(function() {
    return UserModel.removeAsync();
  });

  it('should include login form with correct inputs and submit button', function() {
    page.form.email.getAttribute('type').should.eventually.equal('email');
    page.form.email.getAttribute('name').should.eventually.equal('email');
    page.form.password.getAttribute('type').should.eventually.equal('password');
    page.form.password.getAttribute('name').should.eventually.equal('password');
    page.form.submit.getAttribute('type').should.eventually.equal('submit');
    page.form.submit.getText().should.eventually.equal('Login');
  });

  //it('should include oauth buttons with correct classes applied', function() {
  //  page.form.oauthButtons.google.getText().should.eventually.equal('Connect with Google+');
  //  page.form.oauthButtons.google.getAttribute('class').should.eventually.contain('btn-block');
  //});

  describe('with local auth', function() {

    it('should login a user and redirecting to "/main"', function() {
      page.login(testUser);
      browser.getCurrentUrl().should.eventually.equal(config.baseUrl + '/main');
    });

    describe('and invalid credentials', function() {

      before(function() {
        return loadPage();
      });

      it('should indicate login failures', function() {
        page.login({
          email: testUser.email,
          password: 'badPassword'
        });

        browser.getCurrentUrl().should.eventually.equal(config.baseUrl + '/login');

        //TODO validate error message
        //var helpBlock = page.form.element(by.css('.form-group.has-error .help-block.ng-binding'));
        //helpBlock.getText().should.eventually.equal('This password is not correct.');
      });

    });

  });
});
