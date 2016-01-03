/**
 * Main application routes
 */

'use strict';


import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import http from 'http';

/**
 *
 */
export default function() {
  return {

    //TODO
    app: '',
    mongoose: '',
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
