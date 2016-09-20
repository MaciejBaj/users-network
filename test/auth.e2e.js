'use strict';

var assert = require('assert');
var request = require('request');
var httpUtils = require('request-mocha')(request);
var server = require('../src/server');

describe('Authentication, Authorization', function () {

  before(function () {
    this.credentials = {
      login: 'admin',
      password: 'admin'
    };
  });

  httpUtils.save('http://localhost:3000/');

  it('should not let not logged user to see app content', function (done) {
    request('http://localhost:3000/app', function (error, response, body) {
      assert(!response.url.includes('app'), 'server allows to see app content without logging in');
      assert(JSON.stringify(body.includes('bundle.js')), 'app is not redirected to home page');
      done();
    });
  });


// In an asynchronous `before` block 
  before(function (done) {
    // Prepare the save call 
    httpUtils._save({
      method: 'POST',
      url: 'http://localhost:3000/login',
      form: this.credentials
      // Invoke on the current context with the current callback 
    }).call(this, done);
  });

  it('should log successfully with proper credentials', function (done) {
    assert(this.body.includes("admin"), "did not get user with valid login");
    try {
      JSON.parse(this.body);
    }
    catch (ex) {
      assert(false, 'server is not responding with valid json')
    }
    done();
  });

  it('should allow logged user access application content', function (done) {
    request('http://localhost:3000/app', function (error, response, body) {
      assert(response.statusCode === 200, 'server allows to see app content without logging in');
      done();
    });
  });

});
