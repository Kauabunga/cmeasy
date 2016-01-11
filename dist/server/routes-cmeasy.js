/**
 * Cmeasy application routes
 */

'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _componentsRenderIndexIndex = require('./components/render-index/index');

var _componentsRenderIndexIndex2 = _interopRequireDefault(_componentsRenderIndexIndex);

var _authIndex = require('./auth/index');

var _authIndex2 = _interopRequireDefault(_authIndex);

var _apiUserIndex = require('./api/user/index');

var _apiUserIndex2 = _interopRequireDefault(_apiUserIndex);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

/**
 *
 */

exports['default'] = function (app, cmeasy) {

  app.use('/' + cmeasy.getRootRoute() + '/auth', _authIndex2['default']);
  app.use('/' + cmeasy.getApiRoute() + '/v1/users', _apiUserIndex2['default']);

  app.use('/' + cmeasy.getApiRoute() + '/v1/content/schemacomplete', getCompleteSchemaList(cmeasy));

  app.use('/' + cmeasy.getApiRoute() + '/v1/content/schema', routeSchemaRequest(cmeasy));
  app.use('/' + cmeasy.getApiRoute() + '/v1/content/:type?', routeContentRequest(cmeasy));

  app.use('/' + cmeasy.getRootRoute(), (0, _componentsRenderIndexIndex2['default'])(app, cmeasy));
};

/**
 * TODO ensure that the connection to the database has been achieved before resolving any of these flows
 */
function routeContentRequest(cmeasy) {
  return function (req, res, next) {

    console.log('Routing content request', req.params.type, req.url);

    if (!req.params.type) {
      //Get all content
      //TODO move into cmeasy/schema service

      return cmeasy.getSchemaController().index().then(function (schemas) {
        return _bluebird2['default'].all((0, _lodash2['default'])(schemas).map(function (schema) {
          return [cmeasy.getModel(schema.meta[cmeasy.getIdKey()]), schema];
        }).map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2);

          var model = _ref2[0];
          var schema = _ref2[1];

          if (!model) {
            return cmeasy.createModel(schema).getModelController().indexClean();
          } else {
            return model.getModelController().indexClean();
          }
        }).value()).then(function () {
          for (var _len = arguments.length, indexes = Array(_len), _key = 0; _key < _len; _key++) {
            indexes[_key] = arguments[_key];
          }

          return (0, _lodash2['default'])(indexes).filter().value();
        });
      }).then(function () {
        for (var _len2 = arguments.length, indexes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          indexes[_key2] = arguments[_key2];
        }

        console.log('All content', indexes);
        return res.json(indexes);
      })['catch'](function (err) {
        console.error('Error getting all content', err);
        return res.sendStatus(500);
      });
    } else {
      //Return specific content
      return cmeasy.getSchemaController().index().then(filterSchemaById(cmeasy, req.params.type)).then(function (schema) {
        if (!schema) {
          return undefined;
        } else {
          var cmeasyModel = cmeasy.getModel(req.params.type);
          if (!cmeasyModel) {
            return cmeasy.createModel(schema);
          } else {
            return cmeasyModel;
          }
        }
      }).then(function (cmeasyModel) {
        if (cmeasyModel) {
          return cmeasyModel.getModelCrud()(req, res, next);
        } else {
          return res.sendStatus(404);
        }
      });
    }
  };
}

/**
 *
 * @param cmeasy
 * @returns {Function}
 */
function getCompleteSchemaList(cmeasy) {
  return function (req, res, next) {
    cmeasy.getSchemaController().index().then(function (completeSchema) {
      return res.status(200).json(completeSchema);
    })['catch'](function (err) {
      console.error('Error getting compelte schema list', err);
      return res.sendStatus(500);
    });
  };
}

/**
 *
 * @param type
 * @returns {Function}
 */
function filterSchemaById(cmeasy, type) {
  return function (schemas) {
    return (0, _lodash2['default'])(schemas).filter(function (schema) {
      return schema.meta[cmeasy.getIdKey()] === type;
    }).first();
  };
}

/**
 *
 */
function routeSchemaRequest(cmeasy) {
  return function (req, res, next) {

    console.log('Routing schema request', req.url);

    //get content type from req
    return cmeasy.getSchemaCrud()(req, res, next);
  };
}
module.exports = exports['default'];
//# sourceMappingURL=routes-cmeasy.js.map
