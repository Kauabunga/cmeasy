'use strict';

const path = require('path');
const _ = require('lodash');

/**
 * Export the config object based on the NODE_ENV
 *
 * All configurations will extend these options
 *
 * TODO remove all these process.env.NODE_ENV etc....
 *
 */
module.exports = _.merge(
  getAllConfig(),
  require('./shared'),
  require('./' + (process.env.NODE_ENV || 'production') + '.js') || {},
  {version: getProjectVersion()});

/**
 *
 */
function getAllConfig() {
  return {
    env: process.env.NODE_ENV,

    // Root path of server
    root: path.normalize(__dirname + '/../../..'),

    // Server port
    port: process.env.PORT || 9000,

    // Server IP
    ip: process.env.IP || '0.0.0.0',

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
      session: 'cmeasy-secret'
    },

    // MongoDB connection options
    mongo: {
      options: {
        db: {
          safe: true
        }
      }
    }
  };
}

function getProjectVersion() {
  return require('../../../package.json').version;
}

