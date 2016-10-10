'use strict';

const config = require('./config');
const path = require('path');
const _ = require('lodash');

module.exports = {
  version: require('../../package.json').version,

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  modelFormlyRoute: 'modelFormly',
  modelColumnRoute: 'modelColumn',


  //TODO should move to non-generated appConfig (or extend appConfig)
  adminRoute: 'admin',
  apiRoute: '/admin/api/v1/content',
  usersRoute: '/admin/api/v1/users',
  authRoute: '/admin/auth/local',
  itemIdKey: '_cmeasyId',
  itemInstanceKey: '_cmeasyInstanceId',


  state: {
    root: 'admin',
    login: 'admin.login',
    content: 'admin.content',
    users: 'admin.users',
    types: 'admin.types',
    type: 'admin.type',
    list: 'admin.list',
    item: 'admin.item'
  }
  ,
  adminLeftNavId: 'admin-left-nav',
  env: config.get('NODE_ENV'),

  // Root path of server
  root: path.normalize(`${__dirname}/../..`),

  // Server port,
  port: config.get('CMS_PORT'),

  // Server IP
  ip: config.get('CMS_IP'),

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: config.get('CMS_SESSION_SECRET')
  },

  // MongoDB connection options
  mongo: {
    uri: config.get('CMS_MONGO_URL'),
    options: {
      db: {
        safe: true
      }
    }
  }
};
