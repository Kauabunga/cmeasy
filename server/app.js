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

  return new Cmeasy(userOptions)
    .then(function(cmeasy){

      //TODO move handle mongo connect from cmeasy options here?

      var { app, server, socketio } = prepareExpressServer(cmeasy);

      //require('./config/socketio')(socketio);

      require('./config/express').coreExpress(app, cmeasy);

      //TODO serve up static routes base on rootRoute configuration....
      // i.e. /assets/fonts/xyz.font needs to be served up as /rootRoute/assets/fonts/xyz.font
      require('./config/express').staticExpress(app, cmeasy);

      require('./routes-cmeasy')(app, cmeasy);

      require('./routes')(app, cmeasy);

      if( ! cmeasy.getOptions().isUserDefinedExpressApp()){
        setImmediate(startExpressServer(app, server));
      }

      return app;
    });


};


/**
 *
 */
function prepareExpressServer(cmeasy){

  var app;
  var server;

  if(cmeasy.getOptions().isUserDefinedExpressApp()){
    //TODO validate correctly configured express app?
    app = cmeasy.getOptions().getExpress();
  }
  else {
    app = cmeasy.getOptions().getExpress()();
    server = http.createServer(app);
  }

  //let socketio = require('socket.io')(server, {
  //  serveClient: config.env !== 'production',
  //  path: '/socket.io-client'
  //});

  return {
    app: app,
    server: server//,
    //socketio: socketio
  }
}


/**
 * Start server
 *
 * @param server
 * @returns {Function}
 */
function startExpressServer(app, server) {
  return function(){
    server.listen(config.port, config.ip, function() {
      console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
    });
  }
}
