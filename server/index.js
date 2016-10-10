'use strict';

const config = require('./config/config');
console.log('Cmeasy entry at server/index.js');

if (config.get('NODE_ENV') === 'development' || config.get('NODE_ENV') === 'test') {
  // Register the Babel require hook
  require('babel-core/register');
}

// Export the application
exports = module.exports = require('./app')(require('./options')());
