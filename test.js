/* eslint-env node, mocha */
"use strict";

var fs = require('fs');
var Promise = require('bluebird');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;
var path = require('path');

var BlueGate = require('bluegate');
var Needle = Promise.promisifyAll(require('needle'), {multiArgs: true});

describe('BlueGate static', function() {
  var app;
  var url = 'http://localhost:3000';

  before(function() {
    app = new BlueGate({
      log: false
    });
    require('./bluegate-static.js')(app, {
      filepath: 'test/assets',
      files: 'test/assets/**/*.{jpg,test,unknown}',
      mimeTypes: {test: 'application/x-test'}
    });
    return app.listen(3000);
  });

  after(function() {
    return app.close();
  });

  it('can serve image at basepath', function() {
    return Needle.getAsync(url + '/assets/test.jpg').then(function(response) {
      expect(response[0].statusCode).to.equal(200);
      expect(response[0].headers['content-type']).to.equal('image/jpeg');
      var contents = fs.readFileSync('./test/assets/test.jpg').toString('base64');
      expect(response[1].toString('base64') === contents).to.equal(true);
    });
  });

  it('can serve image from subdirectory', function() {
    return Needle.getAsync(url + '/assets/subdir/test.jpg').then(function(response) {
      expect(response[0].statusCode).to.equal(200);
      expect(response[0].headers['content-type']).to.equal('image/jpeg');
      var contents = fs.readFileSync('./test/assets/subdir/test.jpg').toString('base64');
      expect(response[1].toString('base64') === contents).to.equal(true);
    });
  });

  it('will use custom mimetype', function() {
    return Needle.getAsync(url + '/assets/test.test').then(function(response) {
      expect(response[0].statusCode).to.equal(200);
      expect(response[0].headers['content-type']).to.equal('application/x-test');
    });
  });

  it('will use application/octet-stream for unknown extensions', function() {
    return Needle.getAsync(url + '/assets/test.unknown').then(function(response) {
      expect(response[0].statusCode).to.equal(200);
      expect(response[0].headers['content-type']).to.equal('application/octet-stream');
    });
  });

  it('does not respond to non-existing files', function() {
    return Needle.getAsync(url + '/assets/unknown.txt').then(function(response) {
      expect(response[0].statusCode).to.equal(404);
    });
  });

  it('does not respond to files not matching filter', function() {
    return Needle.getAsync(url + '/assets/test.zip').then(function(response) {
      expect(response[0].statusCode).to.equal(404);
    });
  });

  it('does not allow /../ in directory', function() {
    return Needle.getAsync(url + '/assets/subdir/../test.jpg').then(function(response) {
      expect(response[0].statusCode).to.equal(404);
    });
  });
});
