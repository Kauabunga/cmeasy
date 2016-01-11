'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.IP || undefined,

  // Server port
  port: process.env.PORT || 8080,

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGOLAB_URI || 'mongodb://localhost/cmeasy'
  },

  seedDB: true
};
//# sourceMappingURL=production.js.map
