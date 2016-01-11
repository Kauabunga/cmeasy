'use strict';

console.log('Cmeasy entry at server/index.js');

// Set default node environment to development
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  // Register the Babel require hook
  require('babel-core/register');
}

// Export the application
//TODO create
exports = module.exports = require('./app')(require('./options')());
//# sourceMappingURL=index.js.map
