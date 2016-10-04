'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

// TODO remove the idea of a cmeasy config file

var _configEnvironment = require('./config/environment');

var _configEnvironment2 = _interopRequireDefault(_configEnvironment);

_mongoose2['default'].Promise = require('bluebird');
exports['default'] = function () {
  return {
    name: 'Example Cmeasy',

    // Use a mongoose instance defined outside of the Cmeasy scope
    mongoose: getMongoose(),

    rootRoute: 'admin',

    models: [getHomePageModel(), getBlogModel()]
  };
};

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
        type: 'Html',
        label: 'Blog Content'
      }
    }
  };
}

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

function getMongoose() {
  if (!_mongoose2['default'].connection.readyState) {
    _mongoose2['default'].connect(_configEnvironment2['default'].mongo.uri, _configEnvironment2['default'].mongo.options);
    _mongoose2['default'].connection.on('error', function (err) {
      console.error('MongoDB connection error: ' + err);
      process.exit(-1);
    });
  }
  return _mongoose2['default'];
}
module.exports = exports['default'];
//# sourceMappingURL=options.js.map
