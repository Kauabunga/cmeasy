'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _configEnvironment = require('../config/environment');

var _configEnvironment2 = _interopRequireDefault(_configEnvironment);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _composableMiddleware = require('composable-middleware');

var _composableMiddleware2 = _interopRequireDefault(_composableMiddleware);

var _apiUserUserModel = require('../api/user/user.model');

var _apiUserUserModel2 = _interopRequireDefault(_apiUserUserModel);

var validateJwt = (0, _expressJwt2['default'])({
  secret: _configEnvironment2['default'].secrets.session
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */

function isAuthenticated() {
  return (0, _composableMiddleware2['default'])()
  // Validate jwt
  .use(function (req, res, next) {
    // allow access_token to be passed through query parameter as well
    if (req.query && req.query.hasOwnProperty('access_token')) {
      return req.headers.authorization = 'Bearer ' + req.query.access_token; //jshint ignore:line
    } else {
        return validateJwt(req, res, next);
      }
  })
  // Attach user to request
  .use(function (req, res, next) {
    return _apiUserUserModel2['default'].findByIdAsync(req.user._id).then(function (user) {
      if (!user) {
        return res.status(401).end();
      } else {
        req.user = user;
        return next();
      }
    })['catch'](function (err) {
      return next(err);
    });
  });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */

function hasRole(roleRequired) {

  /* istanbul ignore if */
  if (!roleRequired) {
    throw new Error('Required role needs to be set');
  }

  return (0, _composableMiddleware2['default'])().use(isAuthenticated()).use(function meetsRequirements(req, res, next) {
    if (_configEnvironment2['default'].userRoles.indexOf(req.user.role) >= _configEnvironment2['default'].userRoles.indexOf(roleRequired)) {
      return next();
    } else {
      return res.status(403).send('Forbidden');
    }
  });
}

/**
 * Returns a jwt token signed by the app secret
 */

function signToken(id, role) {
  return _jsonwebtoken2['default'].sign({ _id: id, role: role }, _configEnvironment2['default'].secrets.session, {
    expiresIn: 60 * 60 * 5
  });
}
//# sourceMappingURL=auth.service.js.map
