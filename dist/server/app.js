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
    var _connectToServer = connectToServer(cmeasy);

    var app = _connectToServer.app;
    var server = _connectToServer.server;
    var socketio = _connectToServer.socketio;

    require('./config/socketio')(socketio);

    require('./config/express').coreExpress(app);

    require('./routes-cmeasy')(app, cmeasy);

    require('./config/express').staticExpress(app);

    require('./routes')(app, cmeasy);

    setImmediate(startServer(app, server));

    return app;
  });
};

/**
 *
 */
function connectToServer(cmeasy) {
  var app = cmeasy.getExpress()();
  var server = _http2['default'].createServer(app);
  var socketio = require('socket.io')(server, {
    serveClient: _configEnvironment2['default'].env !== 'production',
    path: '/socket.io-client'
  });

  return {
    app: app,
    server: server,
    socketio: socketio
  };
}

/**
 * Start server
 *
 * @param server
 * @returns {Function}
 */
function startServer(app, server) {
  return function () {
    server.listen(_configEnvironment2['default'].port, _configEnvironment2['default'].ip, function () {
      console.log('Express server listening on %d, in %s mode', _configEnvironment2['default'].port, app.get('env'));
    });
  };
}
//# sourceMappingURL=app.js.map
