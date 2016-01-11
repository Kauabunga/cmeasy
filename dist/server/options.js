/**
 * Main application routes
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

//TODO remove the idea of a cmeasy config file

var _configEnvironment = require('./config/environment');

var _configEnvironment2 = _interopRequireDefault(_configEnvironment);

/**
 *
 */

_mongoose2['default'].Promise = require('bluebird');

exports['default'] = function () {

  return {
    name: 'Example Cmeasy',

    //Use a mongoose instance defined outside of the Cmeasy scope
    mongoose: getMongoose(),

    //Use an express app instance defined outside of the Cmeasy scope
    express: getExpress(),

    rootRoute: 'admin',

    models: [getHomePageModel(), getBlogModel()]
  };
};

/**
 *
 */
function getBlogModel() {
  return {

    name: 'Blog Post',
    singleton: false,

    disableDelete: false,
    disableCreate: false,

    definition: {
      title: {
        type: 'String',
        label: 'Blog Title',
        displayColumn: true
      },
      category: {
        type: 'Select',
        label: 'Blog category',
        'enum': ['Update', 'Random']
      },
      content: {
        type: 'String',
        label: 'Blog Content'
      }
    }
  };
}

/**
 *
 */
function getHomePageModel() {
  return {

    name: 'Home Page',
    singleton: true,

    definition: {
      title: {
        type: 'String',
        label: 'Home Page Title',
        'default': 'Default Home Page Title'
      }
    }
  };
}

/**
 *
 * TODO Extend this example a little farther so we are able to serve up a static index / another route entirely
 * TODO Validate express addons non conflicting - namespace addons/addons only to selected root route?
 *
 * @returns {*}
 */
function getExpress() {
  var app = (0, _express2['default'])();
  var server = _http2['default'].createServer(app);

  setImmediate(startServer(app, server));

  return app;
}

/**
 * Start server
 *
 * @param server
 * @returns {Function}
 */
function startServer(app, server) {
  return function () {
    server.listen(_configEnvironment2['default'].port, _configEnvironment2['default'].ip, function () {
      console.log('Express server listening on %d, in %s mode', _configEnvironment2['default'].port, app.get('env'));
    });
  };
}

function getMongoose() {

  _mongoose2['default'].connect(_configEnvironment2['default'].mongo.uri, _configEnvironment2['default'].mongo.options);
  _mongoose2['default'].connection.on('error', function (err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
  });

  return _mongoose2['default'];
}
module.exports = exports['default'];
//# sourceMappingURL=options.js.map
