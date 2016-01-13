

'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _configEnvironment = require('../../config/environment');

var _configEnvironment2 = _interopRequireDefault(_configEnvironment);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _htmlMinifier = require('html-minifier');

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

/**
 *
 */

exports['default'] = function (app, cmeasy) {

  var indexDotHtml = undefined;

  return function renderIndexHtml(req, res, next) {

    var cspNonce = _uuid2['default'].v4().replace(/-/g, '');

    return _bluebird2['default'].all([getIndexAsString(), getInjectedVariables(cspNonce, req)]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var ejsIndexTemplate = _ref2[0];
      var injectedVariables = _ref2[1];

      return res.header('content-type', 'text/html; charset=UTF-8').end(ejsIndexTemplate(injectedVariables));
    })['catch'](function (err) {
      console.error('Error rendering index.html', err);
      return res.sendStatus(500);
    });
  };

  /**
   *
   */
  function getInjectedVariables(cspNonce, req) {
    return _bluebird2['default'].all([cmeasy.getSchemaController().index()]).then(function (_ref3) {
      var _ref32 = _slicedToArray(_ref3, 1);

      var models = _ref32[0];

      return {
        cmeasy: JSON.stringify({
          env: _configEnvironment2['default'].env,
          version: _configEnvironment2['default'].version,
          rootRoute: cmeasy.getRootRoute(),
          models: models
        }),
        requestPath: req.path,
        cspNonce: cspNonce,
        rootStaticRoute: cmeasy.getRootRoute() + '/'
        //rootStaticRoute: ''
      };
    });
  }

  /**
   *
   */
  function getIndexAsString() {
    if (!indexDotHtml || _configEnvironment2['default'].env === 'development') {
      return new _bluebird2['default'](function (success, failure) {
        return _fs2['default'].readFile(getIndexFilePath(), 'utf8', function (err, indexTemplate) {
          if (err) {
            return failure(err);
          } else {
            return success(_ejs2['default'].compile(minifyTemplate(indexTemplate), { rmWhitespace: true }));
          }
        });
      });
    } else {
      return _bluebird2['default'].resolve(indexDotHtml);
    }
  }

  /**
   *
   * @param template
   */
  function minifyTemplate(template) {
    return (0, _htmlMinifier.minify)(template, {
      minifyJS: true,
      minifyCSS: true,
      removeComments: true
    });
  }

  /**
   *
   */
  function getIndexFilePath() {
    return _path2['default'].resolve(app.get('appPath') + '/index.template.html');
  }
};

module.exports = exports['default'];
//# sourceMappingURL=render-index.js.map
