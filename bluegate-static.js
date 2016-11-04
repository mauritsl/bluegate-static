"use strict";

var Promise = require('bluebird');
var path = require('path');
var fs = Promise.promisifyAll(require('fs'));

var _ = require('lodash');
var globby = require('globby');

var mimeTypes = require('./mimetypes');

module.exports = function(app, options) {
  options = _.defaults(options, {
    filepath: 'assets',
    webpath: '/assets',
    files: path.join(process.cwd(), 'assets/**/*')
  });
  options.mimeTypes = _.defaults(mimeTypes, options.mimeTypes);

  // Make sure that we have the full path to the files.
  options.filepath = path.normalize(path.resolve(process.cwd(), options.filepath));

  // Loop though all files.
  globby.sync(options.files).forEach(file => {
    file = path.resolve(process.cwd(), file);
    var relativePath = file.substring(options.filepath.length);
    var webPath = path.join('/', options.webpath, relativePath);
    app.process('GET ' + webPath, function() {
      var ext = path.extname(webPath).replace('.', '');
      if (typeof options.mimeTypes[ext] !== 'undefined') {
        this.mime = options.mimeTypes[ext];
      }
      return fs.readFileAsync(file);
    });
  });
};
