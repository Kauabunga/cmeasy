'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _cmeasy = require('./cmeasy');

var _cmeasy2 = _interopRequireDefault(_cmeasy);

var config = require('./config/config');

exports = module.exports = function initialiseCmeasy() {
  var userOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return _cmeasy2['default'].create(userOptions).then(function cmeasyCallback(cmeasy) {

    // TODO move handle mongo connect from cmeasy options here?

    var _prepareExpressServer = prepareExpressServer(cmeasy);

    var app = _prepareExpressServer.app;
    var server = _prepareExpressServer.server;

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
    server = _http2['default'].createServer(app);
  }

  return {
    app: app,
    server: server
  };
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
      console.log('Express server listening on ' + userOptions.port + ', in ' + userOptions.ip + ' mode');
    });
  };
}
//# sourceMappingURL=app.js.map
