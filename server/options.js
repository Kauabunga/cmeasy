'use strict';

import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import http from 'http';

// TODO remove the idea of a cmeasy config file
import config from './config/environment';

export default function() {
  return {
    name: 'Example Cmeasy',

    // Use a mongoose instance defined outside of the Cmeasy scope
    mongoose: getMongoose(),

    // Use an express app instance defined outside of the Cmeasy scope
    express: getExpress(),

    rootRoute: 'admin',

    models: [
      getHomePageModel(),
      getBlogModel()
    ]
  };
}

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
        enum: ['Update', 'Random']
      },
      content: {
        type: 'Html',
        label: 'Blog Content'
      }
    }
  }
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
        default: 'Default Home Page Title'
      }
    }
  }
}

/**
 *
 * TODO Extend this example a little farther so we are able to serve up a static index / another route entirely
 * TODO Validate express addons non conflicting - namespace addons/addons only to selected root route?
 *
 * @returns {*}
 */
function getExpress() {
  var app = express();
  var server = http.createServer(app);

  startServer(app, server);

  return app;
}


/**
 * Start server
 *
 * @param server
 * @returns {Function}
 */
function startServer(app, server) {
  return function() {
    server.listen(config.port, config.ip, function() {
      console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
    });
  }
}

function getMongoose() {
  if (!mongoose.connection.readyState) {
    mongoose.connect(config.mongo.uri, config.mongo.options);
    mongoose.connection.on('error', function(err) {
      console.error('MongoDB connection error: ' + err);
      process.exit(-1);
    });
  }
  return mongoose;
}
