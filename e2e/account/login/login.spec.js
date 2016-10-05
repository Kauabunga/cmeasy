'use strict';

const config = browser.params;
describe('Login View', function() {

  const testUser = {
    name: 'Test User',
    email: 'admin@admin.com',
    password: 'admin'
  };

  let page;
  function loadPage() {
    let promise = browser.get(config.baseUrl + '/login');
    page = require('./login.po');
    return promise;
  }

  before(() => loadPage());

  it('should include login form with correct inputs and submit button', function() {
    page.form.email.getAttribute('type').should.eventually.equal('email');
    page.form.email.getAttribute('name').should.eventually.equal('email');
    page.form.password.getAttribute('type').should.eventually.equal('password');
    page.form.password.getAttribute('name').should.eventually.equal('password');
    page.form.submit.getAttribute('type').should.eventually.equal('submit');
    page.form.submit.getText().should.eventually.equal('Login');
  });

  describe('with local auth', function() {

    it('should login a user and redirecting to "/content"', function() {
      page.login(testUser);
      browser.getCurrentUrl().should.eventually.equal(config.baseUrl + '/content');
    });

    describe('and invalid credentials', function() {

      before(() => loadPage());

      it('should indicate login failures', function() {
        page.login({
          email: testUser.email,
          password: 'badPassword'
        });

        browser.getCurrentUrl().should.eventually.equal(config.baseUrl + '/login');
      });
    });
  });
});
