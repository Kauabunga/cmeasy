/**
 * Main application routes
 */

'use strict';


import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import http from 'http';
import config from './config/environment';


/**
 *
 */
export default function() {

  return {

    name: 'Example Cmeasy',

    //TODO
    app: '',
    mongoose: getMongoose(),
    express: '',
    server: '',
    socketio: '',

    rootRoute: 'admin',

    auth: {
      authenticate: () => {},
      getUserFromToken: () => {}
    },

    models: getModels()
  };
}

function getMongoose(){

  mongoose.connect(config.mongo.uri, config.mongo.options);
  mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
  });

  return mongoose;
}

/**
 *
 */
function getModels(){
  return [
    getHomePageModel(),
    getBlogModel()
  ]
}


/**
 *
 */
function getBlogModel(){
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
        type: 'String',
        label: 'Blog Content'
      }
    }
  }
}


/**
 *
 */
function getHomePageModel(){
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
