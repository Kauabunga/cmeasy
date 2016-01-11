/**
 * Main application file
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _configEnvironment = require('./config/environment');

var _configEnvironment2 = _interopRequireDefault(_configEnvironment);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _cmeasy = require('./cmeasy');

var _cmeasy2 = _interopRequireDefault(_cmeasy);

/**
 * Expose app
 *
 * TODO expose as app and also expose as express route
 *
 * @type {Function}
 */
exports = module.exports = function () {
  var userOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return new _cmeasy2['default'](userOptions).then(function (cmeasy) {

    //TODO move handle mongo connect from cmeasy options here?

    var _prepareExpressServer = prepareExpressServer(cmeasy);

    var app = _prepareExpressServer.app;
    var server = _prepareExpressServer.server;
    var socketio = _prepareExpressServer.socketio;

    //require('./config/socketio')(socketio);

    require('./config/express').coreExpress(app);

    require('./routes-cmeasy')(app, cmeasy);

    require('./config/express').staticExpress(app);

    require('./routes')(app, cmeasy);

    if (!cmeasy.getOptions().isUserDefinedExpressApp()) {
      setImmediate(startExpressServer(app, server));
    }

    return app;
  });
};

/**
 *
 */
function prepareExpressServer(cmeasy) {

  var app;
  var server;

  if (cmeasy.getOptions().isUserDefinedExpressApp()) {
    //TODO validate correctly configured express app?
    app = cmeasy.getOptions().getExpress();
  } else {
    app = cmeasy.getOptions().getExpress()();
    server = _http2['default'].createServer(app);
  }

  //let socketio = require('socket.io')(server, {
  //  serveClient: config.env !== 'production',
  //  path: '/socket.io-client'
  //});

  return {
    app: app,
    server: server //,
    //socketio: socketio
  };
}

/**
 * Start server
 *
 * @param server
 * @returns {Function}
 */
function startExpressServer(app, server) {
  return function () {
    server.listen(_configEnvironment2['default'].port, _configEnvironment2['default'].ip, function () {
      console.log('Express server listening on %d, in %s mode', _configEnvironment2['default'].port, app.get('env'));
    });
  };
}
//# sourceMappingURL=app.js.map
