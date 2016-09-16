'use strict';

var assert = require('assert');
var request = require('request');
var httpUtils = require('request-mocha')(request);
var server = require('../src/server');

describe('Server serves files', function () {

  httpUtils.save('http://localhost:3000/');

  it('renders home page properly', function () {
    assert(JSON.stringify(this.body.includes('bundle.js')), 'bundle.js file is nto attached to html file');
    assert(this.res.statusCode === 200, 'did not receive success status');
  });

  it('should not let not logged user to see app content', function (done) {
    request('http://localhost:3000/app', function (error, response, body) {
      assert(!response.url.includes('app'), 'server allows to see app content without logging in');
      assert(JSON.stringify(body.includes('bundle.js')), 'app is not redirected to home page');
      done();
    });

  });

});
