'use strict';

var config = browser.params;
var UserModel = require(config.serverConfig.root + '/server/api/user/user.model');

describe('Signup View', function() {
  var page;

  var loadPage = function() {
    browser.manage().deleteAllCookies()
    let promise = browser.get(config.baseUrl + '/signup');
    page = require('./signup.po');
    return promise;
  };

  var testUser = {
    name: 'Test',
    email: 'test@example.com',
    password: 'test',
    confirmPassword: 'test'
  };

  before(function() {
    return loadPage();
  });

  after(function() {
    return UserModel.removeAsync();
  });

  it('should include signup form with correct inputs and submit button', function() {
    page.form.name.getAttribute('type').should.eventually.equal('text');
    page.form.name.getAttribute('name').should.eventually.equal('name');
    page.form.email.getAttribute('type').should.eventually.equal('email');
    page.form.email.getAttribute('name').should.eventually.equal('email');
    page.form.password.getAttribute('type').should.eventually.equal('password');
    page.form.password.getAttribute('name').should.eventually.equal('password');
    page.form.confirmPassword.getAttribute('type').should.eventually.equal('password');
    page.form.confirmPassword.getAttribute('name').should.eventually.equal('confirmPassword');
    page.form.submit.getAttribute('type').should.eventually.equal('submit');
    page.form.submit.getText().should.eventually.equal('Sign up');
  });

  it('should include oauth buttons with correct classes applied', function() {
    page.form.oauthButtons.google.getText().should.eventually.equal('Connect with Google+');
    page.form.oauthButtons.google.getAttribute('class').should.eventually.contain('btn-block');
  });

  describe('with local auth', function() {

    before(function() {
      return UserModel.removeAsync();
    })

    it('should signup a new user, log them in, and redirecting to "/"', function() {
      page.signup(testUser);

      var navbar = require('../../components/navbar/navbar.po');

      browser.getCurrentUrl().should.eventually.equal(config.baseUrl + '/');
      navbar.navbarAccountGreeting.getText().should.eventually.equal('Hello ' + testUser.name);
    });

    describe('and invalid credentials', function() {
      before(function() {
        return loadPage();
      });

      it('should indicate signup failures', function() {
        page.signup(testUser);

        browser.getCurrentUrl().should.eventually.equal(config.baseUrl + '/signup');
        page.form.email.getAttribute('class').should.eventually.contain('ng-invalid-mongoose');

        var helpBlock = page.form.element(by.css('.form-group.has-error .help-block.ng-binding'));
        helpBlock.getText().should.eventually.equal('The specified email address is already in use.');
      });

    });

  });
});
