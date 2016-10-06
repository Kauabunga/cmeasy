/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/generated              ->  index
 * POST    /api/generated              ->  create
 * GET     /api/generated/:id          ->  show
 * PUT     /api/generated/:id          ->  update
 * DELETE  /api/generated/:id          ->  destroy
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _cmeasyFunctionsModels = require('./cmeasy.functions.models');

var debug = require('debug')('cmeasy:controller:model');

/**
 * TODO catch and rethrow for ensured logging
 */

exports['default'] = function (model, cmeasy) {
  return {
    index: index,
    indexClean: _lodash2['default'].flow(index, cleanObject),
    create: create,
    show: show,
    history: history,
    destroy: destroy
  };

  /**
   * Gets a list of Generateds
   */
  function index() {
    debug('index');
    return (0, _cmeasyFunctionsModels.getModelSchema)(cmeasy, model).then(function (schema) {
      if ((0, _cmeasyFunctionsModels.isSchemaSingleton)(schema)) {
        debug('Returning singleton for ' + model.getId());
        return showSingleton(model.getId())
        // convert back into an array to keep consistency
        .then(function (singleton) {
          return [].concat(singleton);
        });
      }

      debug('Returning list of models of id ' + model.getId());
      return model.getModel().find({}).sort((0, _cmeasyFunctionsModels.getSortQuery)()).exec().then(getUniqueIds(model, schema));
    });
  }

  /**
   * Gets a single Generated from the DB
   */
  function show(id) {
    debug('show:start getting: ' + model.getId() + ' with id: ' + id);
    return (0, _cmeasyFunctionsModels.getModelSchema)(cmeasy, model).then(function (schema) {
      debug('show getModelSchema successful');
      if ((0, _cmeasyFunctionsModels.isSchemaSingleton)(schema)) {
        debug('show getModelSchema returning singleton');
        return showSingleton(id);
      }

      debug('show getModelSchema returning instance with id ' + id);
      return (0, _cmeasyFunctionsModels.showInstance)(id, model);
    }).then(function (item) {
      debug('show:finishing with model id: ' + model.getId() + ', called with id: ' + id + ', returning: ' + item);
      return item;
    });
  }

  /**
   * @param id
   * @returns {*}
   */
  function showSingleton(id) {
    return model.getModel().find((0, _cmeasyFunctionsModels.getIdQuery)(id, {
      meta: {
        singleton: true
      }
    }, model)).sort((0, _cmeasyFunctionsModels.getSortQuery)()).exec().then(function (items) {
      // if this item is a singleton and there isn't one -> go and create it
      if (!items || items.length === 0) {
        return create({});
      } else {
        return (0, _lodash2['default'])(items).first();
      }
    });
  }

  /**
   * Creates a new Generated in the DB
   */
  function create() {
    var item = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    return (0, _cmeasyFunctionsModels.createInstance)(cmeasy, model, item);
  }

  /**
   * Gets the history of an item
   */
  function history(id) {
    return (0, _cmeasyFunctionsModels.getModelSchema)(cmeasy, model).then(function (schema) {
      return model.getModel().find((0, _cmeasyFunctionsModels.getIdQuery)(id, schema, model)).sort((0, _cmeasyFunctionsModels.getSortQuery)()).exec();
    });
  }

  /**
   * Deletes a Generated from the DB
   */
  function destroy(id) {
    return (0, _cmeasyFunctionsModels.getModelSchema)(cmeasy, model).then(function (schema) {
      return model.getModel().find((0, _cmeasyFunctionsModels.getIdQuery)(id, schema, model)).exec().then(destroyAll);
    });
  }

  /**
   * @param items
   * @returns {*}
   */
  function destroyAll(items) {
    return _bluebird2['default'].all((0, _lodash2['default'])(items).map(function (item) {
      return item.remove();
    }).value());
  }

  function getUniqueIds(model, schema) {
    debug('getUniqueIds');
    return function (entity) {
      debug('getUniqueIds with entity ' + entity);
      if ((0, _cmeasyFunctionsModels.isSchemaSingleton)(schema)) {
        debug('getUniqueIds entity is a singleton');
        return (0, _lodash2['default'])(entity).map(function (item) {
          return item.toObject();
        }).uniq(model.getIdKey()).value();
      }

      debug('getUniqueIds entity is not a singleton');
      return (0, _lodash2['default'])(entity).map(function (item) {
        return item.toObject();
      }).uniq(model.getInstanceKey()).value();
    };
  }

  /**
   * @param item
   * @returns {*}
   */
  function cleanObject(item) {
    if (typeof item.then === 'function') {
      return item.then(_cleanObject);
    } else {
      return _cleanObject(item);
    }
  }

  /**
   * @param item
   * @returns {*}
   * @private
   */
  function _cleanObject(item) {
    if (item instanceof Array) {
      return (0, _lodash2['default'])(item).map(function (singleItem) {
        if (typeof singleItem.toObject === 'function') {
          return _lodash2['default'].omit(singleItem.toObject(), getCleanProperties());
        } else {
          return _lodash2['default'].omit(singleItem, getCleanProperties());
        }
      }).value();
    } else {
      if (typeof item.toObject === 'function') {
        return _lodash2['default'].omit(item.toObject(), getCleanProperties());
      } else {
        return _lodash2['default'].omit(item, getCleanProperties());
      }
    }
  }

  /**
   * @returns {string[]}
   */
  function getCleanProperties() {
    return ['_id', '__v', 'author', 'comment', 'dateCreated'];
  }
};

module.exports = exports['default'];
//# sourceMappingURL=cmeasy.controller.model.js.map
