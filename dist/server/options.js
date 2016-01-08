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

/**
 *
 */

_mongoose2['default'].Promise = require('bluebird');

exports['default'] = function () {
  return {

    //TODO
    app: '',
    mongoose: '',
    express: '',
    server: '',
    socketio: '',

    rootRoute: 'admin',

    auth: {
      authenticate: function authenticate() {},
      getUserFromToken: function getUserFromToken() {}
    },

    models: getModels()
  };
};

/**
 *
 */
function getModels() {
  return [getHomePageModel(), getBlogModel()];
}

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
module.exports = exports['default'];
//# sourceMappingURL=options.js.map
