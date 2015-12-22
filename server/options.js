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

    definition: {
      title: {
        type: String,
        label: 'Blog Title'
      },
      content: {
        type: String,
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
        type: String,
        label: 'Home Page Title'
      }
    }
  }
}