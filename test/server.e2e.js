'use strict';

var assert = require('assert');
var request = require('request');
var httpUtils = require('request-mocha')(request);
var server = require('../src/server');

describe('Server', function () {

  httpUtils.save('http://localhost:3000/');

  it('renders home page properly', function () {
    assert(JSON.stringify(this.body.includes('bundle.js')), 'bundle.js file is nto attached to html file');
    assert(this.res.statusCode === 200, 'did not receive success status');
  });

});
