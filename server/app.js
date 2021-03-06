'use strict';

const config = require('./config/config');
import http from 'http';
import Cmeasy from './cmeasy';

exports = module.exports = function initialiseCmeasy(userOptions = {}) {

  return Cmeasy.create(userOptions)
    .then(function cmeasyCallback(cmeasy) {

      // TODO move handle mongo connect from cmeasy options here?
      var {app, server} = prepareExpressServer(cmeasy);

      require('./config/express').coreExpress(app, cmeasy);

      // TODO serve up static routes base on rootRoute configuration....
      // i.e. /assets/fonts/xyz.font needs to be served up as /rootRoute/assets/fonts/xyz.font
      require('./config/express').staticExpress(app, cmeasy);

      require('./routes-cmeasy')(app, cmeasy);

      require('./routes')(app, cmeasy);

      if (!cmeasy.getOptions().isUserDefinedExpressApp()) {
        setImmediate(startExpressServer(server, userOptions));
      }

      return cmeasy;
    });
};

function prepareExpressServer(cmeasy) {
  var app;
  var server;

  if (cmeasy.getOptions().isUserDefinedExpressApp()) {
    // TODO validate correctly configured express app?
    app = cmeasy.getOptions().getExpress();
  } else {
    app = cmeasy.getOptions().getExpress()();
    server = http.createServer(app);
  }

  return {
    app: app,
    server: server
  }
}

/**
 * Start server
 *
 * @param server
 * @returns {Function}
 */
function startExpressServer(server, userOptions) {
  return function startServer() {
    server.listen(userOptions.port, userOptions.ip, function listenCallback() {
      console.log(`Express server listening on ${userOptions.port}, in ${userOptions.ip} mode`);
    });
  }
}
