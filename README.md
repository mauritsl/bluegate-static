BlueGate Static
==================

[![Build Status](https://travis-ci.org/mauritsl/bluegate-static.svg?branch=master)](https://travis-ci.org/mauritsl/bluegate-static)
[![Coverage Status](https://coveralls.io/repos/mauritsl/bluegate-static/badge.svg?branch=master)](https://coveralls.io/r/mauritsl/bluegate-static?branch=master)
[![Dependency Status](https://david-dm.org/mauritsl/bluegate-static.svg)](https://david-dm.org/mauritsl/bluegate)

Serve static assets in a [BlueGate](https://www.npmjs.com/package/bluegate) application.

This module is intended for small amounts of files, such as CSS-files and images.
The list of available paths is generated on startup. A single file read is executed
when requesting a file. This has advantages for performance and security, but is not
suitable for many files or user uploads.

## Installation

Install using ``npm install bluegate-static``

## Quick example

Serve static files in ``/assets`` folder.
```javascript
var BlueGate = require('bluegate');
var app = new BlueGate();
app.listen(8080);

require('bluegate-static')(app);
```

## Custom options

The following options can be provided:

* ``filepath`` is the basepath on the local file system.
* ``webpath`` is the basepath on the website.
* ``files`` is the pattern, parsed by the [globby](https://www.npmjs.com/package/globby) module.

All files are served on "/webpath/relativepath", where "relativepath" is the path on the local
filesystem without the path provided in``filepath``.

Example to serve files in "css", "js" and "images" directories.

```javascript
var BlueGate = require('bluegate');
var app = new BlueGate();
app.listen(8080);

require('bluegate-static')(app, {
  filepath: '',
  webpath: '/',
  files: '{css,js,images}/**/*.{css,js,png,gif,jpg,jpeg,svg,woff,woff2,eot,ttf}'
});
```

## MIME-types

This module includes a list of common
[built-in MIME-types](https://github.com/mauritsl/bluegate-static/blob/master/mimetypes.js).
You can however specify extra MIME-types in the options.

```javascript
require('bluegate-static')(app, {
  mimeTypes: {test: 'application/x-test'}
});
```
