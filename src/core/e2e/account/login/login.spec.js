'use strict';

var config = browser.params;
var UserModel = require(config.serverConfig.root + '/server/model/user');

describe('Login View', function () {
  var page;

  var loadPage = function () {
    var url = config.baseUrl + '/signin';
    console.log('navigate to', url);
    page = require('./login.po');
    return browser.get(url);
  };

  var testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'test'
  };

  beforeEach(
    function (done) {
      UserModel
        .remove()
        .then(function () {
          return UserModel.create(testUser);
        })
        .then(loadPage)
        .finally(done);
    }
  );

  it('should include signIn form with correct inputs and submit button', function () {
    expect(page.form.email.getAttribute('type')).toBe('email');
    expect(page.form.email.getAttribute('name')).toBe('email');
    expect(page.form.password.getAttribute('type')).toBe('password');
    expect(page.form.password.getAttribute('name')).toBe('password');
    expect(page.form.submit.getAttribute('type')).toBe('submit');
    expect(page.form.submit.getText()).toBe('Login');
  });

  it('should include oauth buttons with correct classes applied', function () {
    expect(page.form.oauthButtons.facebook.getText()).toBe('Connect with Facebook');
    expect(page.form.oauthButtons.facebook.getAttribute('class')).toMatch('btn-block');
    expect(page.form.oauthButtons.google.getText()).toBe('Connect with Google+');
    expect(page.form.oauthButtons.google.getAttribute('class')).toMatch('btn-block');
    expect(page.form.oauthButtons.twitter.getText()).toBe('Connect with Twitter');
    expect(page.form.oauthButtons.twitter.getAttribute('class')).toMatch('btn-block');
  });

  describe('with local auth', function () {

    it('should signIn a user and redirecting to "/"', function () {
      page.signIn(testUser);

      var navbar = require('../../components/navbar/navbar.po');

      expect(browser.getCurrentUrl()).toBe(config.baseUrl + '/');
      expect(navbar.navbarAccountGreeting.getText()).toBe('Hello ' + testUser.name);
    });

    it('should indicate signIn failures', function () {
      page.signIn({
        email: testUser.email,
        password: 'badPassword'
      });

      expect(browser.getCurrentUrl()).toBe(config.baseUrl + '/signin');

      var helpBlock = page.form.element(by.css('.form-group.has-error .help-block.ng-binding'));
      expect(helpBlock.getText()).toBe('This password is not correct.');
    });

  });
});
