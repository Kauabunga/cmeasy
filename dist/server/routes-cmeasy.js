'use strict';

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

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

var debug = require('debug')('cmeasy:routes:cmeasy');

exports['default'] = function (app, cmeasy) {
  app.use('/' + cmeasy.getRootRoute() + '/auth', _authIndex2['default']);
  app.use('/' + cmeasy.getApiRoute() + '/v1/users', _apiUserIndex2['default']);

  app.use('/' + cmeasy.getApiRoute() + '/v1/content/schemacomplete', getCompleteSchemaList(cmeasy));

  app.use('/' + cmeasy.getApiRoute() + '/v1/content/schema', routeSchemaRequest(cmeasy));
  app.use('/' + cmeasy.getApiRoute() + '/v1/content/:type?', routeContentRequest(cmeasy));
  app.use('/' + cmeasy.getApiRoute() + '/v1/content.js', routeContentJsRequest(cmeasy));

  app.use('/' + cmeasy.getRootRoute(), (0, _componentsRenderIndexIndex2['default'])(app, cmeasy));
};

/**
 * TODO ensure that the connection to the database has been achieved before resolving any of these flows
 */
function routeContentRequest(cmeasy) {
  return function (req, res, next) {
    debug('Routing content request ' + req.params.type + ', ' + req.url);

    if (!req.params.type) {
      debug('Getting all content');
      return getAllContent(cmeasy).then(function (indexes) {
        return res.json(indexes);
        debug('All content ' + JSON.stringify(indexes));
      })['catch'](function (err) {
        console.error('Error getting all content', err);
        return res.sendStatus(500);
      });
    }

    debug('Return specific type: ' + req.params.type);
    return getContentModel(cmeasy, req.params.type).then(function (cmeasyModel) {
      if (!cmeasyModel) {
        return res.sendStatus(404);
      }

      return cmeasyModel.getModelCrud()(req, res, next);
    });
  };
}

/**
 * TODO extend this so individual content pieces can be grabbed
 *
 * e.g. api/v1/content/homePage.js
 *
 * @param cmeasy
 */
function routeContentJsRequest(cmeasy) {

  //TODO configure this
  var prependJs = 'window._cmeasy_content = ';

  return function (req, res, next) {

    debug('Routing content js request ' + req.params.type + ' ' + req.url);

    //Get all content as js
    return getAllContent(cmeasy).then(function (indexes) {
      debug('All content as js ' + JSON.stringify(indexes));

      return res.status(200).set('Cache-Control', 'no-cache, no-store, must-revalidate').set('Pragma', 'no-cache').set('Expires', 0).set('Content-Type', 'application/javascript').send(prependJs + JSON.stringify(indexes));
    })['catch'](function (err) {
      console.error('Error getting all content as js', err);
      return res.sendStatus(500);
    });
  };
}

function getContentModel(cmeasy, type) {
  return cmeasy.getSchemaController().index().then(filterSchemaById(cmeasy, type)).then(function (schema) {
    if (!schema) {
      return undefined;
    }

    var cmeasyModel = cmeasy.getModel(type);
    if (!cmeasyModel) {
      return cmeasy.createModel(schema);
    }

    return cmeasyModel;
  });
}

function getAllContent(cmeasy) {
  return cmeasy.getSchemaController().index().then(function (schemas) {
    return _bluebird2['default'].all((0, _lodash2['default'])(schemas).map(function (schema) {
      return [cmeasy.getModel(schema.meta[cmeasy.getIdKey()]), schema];
    }).map(function (_ref2) {
      var _ref22 = _slicedToArray(_ref2, 2);

      var model = _ref22[0];
      var schema = _ref22[1];

      if (!model) {
        return cmeasy.createModel(schema).getModelController().indexClean();
      } else {
        return model.getModelController().indexClean();
      }
    }).map(function (index) {
      return index.then(function (indexResult) {
        //TODO should probably handle singleton differently here
        if (indexResult.length > 0) {
          return _defineProperty({}, indexResult[0][cmeasy.getIdKey()], indexResult);
        }

        return {};
      });
    }).value()).then(function (indexes) {
      return (0, _lodash2['default'])(indexes).reduce(_lodash2['default'].merge);
    });
  });
}

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

function filterSchemaById(cmeasy, type) {
  return function (schemas) {
    return (0, _lodash2['default'])(schemas).filter(function (schema) {
      return schema.meta[cmeasy.getIdKey()] === type;
    }).first();
  };
}

function routeSchemaRequest(cmeasy) {
  return function (req, res, next) {
    debug('Routing schema request ' + req.url);
    return cmeasy.getSchemaCrud()(req, res, next);
  };
}
module.exports = exports['default'];
//# sourceMappingURL=routes-cmeasy.js.map
