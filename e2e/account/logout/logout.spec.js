'use strict';

var config = browser.params;
var UserModel = require(config.serverConfig.root + '/server/model/user');

describe('Logout View', function() {

  var page;

  var loadPage = function() {
    var url = config.baseUrl + '/login';
    console.log('navigate to', url);
    page = require('../login/login.po');
    return browser.get(url);
  };

  var testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'test'
  };

  var login = function() {
    page.login(testUser);
  };

  beforeEach(function(done) {
    UserModel.removeAsync()
      .then(function() {
        return UserModel.createAsync(testUser);
      })
      .then(function() {
        return loadPage();
      })
      .finally(done);
  });

  describe('with local auth', function() {

    it('should logout a user and redirecting to "/"', function() {

      login();

      var navbar = require('../../components/navbar/navbar.po');

      expect(browser.getCurrentUrl()).toBe(config.baseUrl + '/');
      expect(navbar.navbarAccountGreeting.getText()).toBe('Hello ' + testUser.name);

      browser.get(config.baseUrl + '/logout');

      navbar = require('../../components/navbar/navbar.po');

      expect(browser.getCurrentUrl()).toBe(config.baseUrl + '/');
      expect(navbar.navbarAccountGreeting.isDisplayed()).toBe(false);
    });

  });
});
