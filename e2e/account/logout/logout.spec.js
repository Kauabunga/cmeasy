'use strict';

const config = browser.params;
describe('Logout View', function() {

  const testUser = {
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  };

  before(() => {
    let promise = browser.get(config.baseUrl + '/login');
    require('../login/login.po').login(testUser);
    return promise;
  });

  describe('with local auth', function() {

    it('should logout a user and redirecting to "/login"', function() {

      browser.getCurrentUrl().should.eventually.equal(config.baseUrl + '/content');

      browser.get(config.baseUrl + '/logout');

      browser.getCurrentUrl().should.eventually.equal(config.baseUrl + '/login');
    });

  });
});
