'use strict';

import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');

// TODO remove the idea of a cmeasy config file
import config from './config';

export default function() {
  return {
    name: 'Example Cmeasy',

    // Use a mongoose instance defined outside of the Cmeasy scope
    mongoose: getMongoose(),

    port: config.port,

    ip: config.ip,

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
