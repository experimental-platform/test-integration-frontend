var Browser = require('zombie');
var assert  = require('assert');
var child_process = require("child_process");

var remote = child_process.execSync("vagrant ssh-config | awk '/HostName/ {print $2}'");

// DEBUG
console.log('Using remote: ' + remote);

Browser.localhost(remote + ':' + (process.env.PORT || 80));

var browser = Browser.create();
var password = "test1234";

// Load the page from localhost
describe("Welcome wizard", function() {
  this.timeout(40000);

  it("should show first welcome page", function() {
    return browser.visit("/").then(function() {
      browser.assert.text('.btn', 'Begin Setup');
      return browser.clickLink("Begin Setup");
    });
  });

  it("should show the password config page", function() {
    browser.assert.text("li.active", "Password");
    browser.fill("input[ng-model='password']", password);
    browser.fill("input[ng-model='passwordConfirmation']", password);

    return browser.pressButton("Next Step");
  });

  it("should show the public key config page", function() {
    browser.assert.text("li.active", "SSH Public Key");
    var publicKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    browser.fill("textarea[ng-model='publicKey']", publicKey);

    return browser.pressButton("Next Step");
  });

  it("should show the publish-to-web config page", function() {
    browser.assert.text("li.active", "Internet Access");
    var nodeName = "foobar";
    browser.fill("input[ng-model='nodename']", nodeName);

    return browser.pressButton("Finish Setup");
  });

  it("should then redirect to the apps page", function() {
    browser.assert.text("h2", "My Apps");
    browser.assert.text(".publish-to-web-name", "foobar.protonet.info");
  });

  it("can logout and login with new password", function() {
    return browser.clickLink("Logout").then(function() {
      browser.fill("input[ng-model='password']", password);
      return browser.pressButton("Login");
    }).then(function() {
      browser.assert.text("h2", "My Apps");
    });
    
  });
});
