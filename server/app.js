/**
 * Main application file
 */

'use strict';


import config from './config/environment';

import http from 'http';
import _ from 'lodash';
import Cmeasy from './cmeasy';


/**
 * Expose app
 *
 * TODO expose as app and also expose as express route
 *
 * @type {Function}
 */
exports = module.exports = function(userOptions  = {}){

  let cmeasy = new Cmeasy(userOptions);

  connectToMongo(cmeasy);

  let {app, server, socketio} = connectToServer(cmeasy);

  require('./config/socketio')(socketio);

  require('./config/express').coreExpress(app);

  require('./routes-cmeasy')(app, cmeasy);

  require('./config/express').staticExpress(app);

  require('./routes')(app, cmeasy);

  setImmediate(startServer(app, server));

  return app;
};


/**
 *
 */
function connectToServer(cmeasy){
  let app = cmeasy.getExpress()();
  let server = http.createServer(app);
  let socketio = require('socket.io')(server, {
    serveClient: config.env !== 'production',
    path: '/socket.io-client'
  });

  return {
    app: app,
    server: server,
    socketio: socketio
  }
}


/**
 *
 */
function connectToMongo(cmeasy){

  var mongoose = cmeasy.getMongoose();

  mongoose.connect(config.mongo.uri, config.mongo.options);
  mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
  });

  // Populate databases with sample data
  if (config.seedDB) { require('./config/seed'); }

  return mongoose;
}

/**
 * Start server
 *
 * @param server
 * @returns {Function}
 */
function startServer(app, server) {
  return function(){
    server.listen(config.port, config.ip, function() {
      console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
    });
  }
}
