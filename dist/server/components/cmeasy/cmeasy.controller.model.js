/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/generated              ->  index
 * POST    /api/generated              ->  create
 * GET     /api/generated/:id          ->  show
 * PUT     /api/generated/:id          ->  update
 * DELETE  /api/generated/:id          ->  destroy
 */

'use strict';

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

/**
 *
 * TODO catch and rethrow for ensured logging
 */

exports['default'] = function (model, schemaController) {

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
   *
   */
  function index() {
    return getModelSchema().then(function (schema) {
      if (isSchemaSingleton(schema)) {
        return showSingleton(model.getId()).then(function (singleton) {
          //convert back into an array to keep consistency
          return [].concat(singleton);
        });
      } else {
        return model.getModel().find({}).sort(getSortQuery()).exec().then(getUniqueIds(model, schema));
      }
    });
  }

  /**
   * Gets a single Generated from the DB
   *
   */
  function show(id) {

    console.log('Model:Show:Start:' + model.getId() + ':' + id);

    return getModelSchema().then(function (schema) {
      if (isSchemaSingleton(schema)) {
        return showSingleton(id);
      } else {
        return showInstance(id);
      }
    }).then(function (item) {
      console.log('Model:Show:Finish:' + model.getId() + ':' + id + ':' + item);
      return item;
    });
  }

  /**
   *
   * @param id
   * @returns {*}
   */
  function showSingleton(id) {

    return model.getModel().find(getIdQuery(id, { meta: { singleton: true } })).sort(getSortQuery()).exec().then(function (items) {
      //if this item is a singleton and there isn't one -> go and create it
      if (!items || items.length === 0) {
        return create({});
      } else {
        return (0, _lodash2['default'])(items).first();
      }
    });
  }

  /**
   *
   * @param id
   * @param schema
   */
  function showInstance(id) {
    return model.getModel().find(getIdQuery(id, { meta: { singleton: false } })).sort(getSortQuery()).exec().then(function (items) {
      return (0, _lodash2['default'])(items).first();
    });
  }

  /**
   * Creates a new Generated in the DB
   *
   */
  function create() {
    var item = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    console.log('Model:Create:Start:' + model.getId() + ':' + (item[model.getInstanceKey()] || '') + ':' + (item || ''));

    return getCreateResolve(item).then(function (_ref8) {
      var _ref82 = _slicedToArray(_ref8, 2);

      var schema = _ref82[0];
      var currentItem = _ref82[1];

      return model.getModel().create(getCreateItem(schema, item, currentItem));
    }).then(function (createdItem) {
      console.log('Model:Create:Finish:' + model.getId() + ':' + (item[model.getInstanceKey()] || '') + ':' + (createdItem || ''));
      return createdItem;
    });
  }

  /**
   *
   */
  function getCreateResolve(item) {

    return getModelSchema().then(function (schema) {

      //If the model is not a singleton or it contains an instance key
      //then we need to go fetch the previous instance (if one exists)
      if (!isSchemaSingleton(schema) || item[model.getInstanceKey()]) {
        return showInstance(item[model.getInstanceKey()]).then(getModelAsObject).then(function () {
          var currentItem = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          return [schema, currentItem];
        });
      } else {
        return [schema, {}];
      }
    });
  }

  /**
   *
   * @returns {*}
   */
  function getModelSchema() {
    return schemaController.show(model.getId());
  }

  /**
   *
   */
  function isSchemaSingleton(schema) {
    return schema && schema.meta && schema.meta.singleton;
  }

  /**
   *
   * @returns {Object}
   */
  function getCreateItem(schema, item) {
    var currentItem = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    return _lodash2['default'].merge(getDefaultItem(schema), getStrippedCurrentItem(currentItem), getValidItem(schema, item));
  }

  /**
   *
   * @param schema
   * @param item
   */
  function getValidItem(schema, item) {
    return (0, _lodash2['default'])(item).map(getValidItemProperty(schema.definition)).filter().reduce(_lodash2['default'].merge) || {};
  }

  /**
   *
   */
  function getStrippedCurrentItem(currentItem) {
    return _lodash2['default'].omit(currentItem, ['_id', '__v', 'author', 'dateCreated', 'comment']);
  }

  /**
   *
   * @param value
   * @param key
   */
  function getValidItemProperty(schema) {
    return function (value, key) {

      //TODO test to make sure schema[key].type === value.prototype or something along those lines
      return isEditDisabled(schema, key) ? _defineProperty({}, key, undefined) : _defineProperty({}, key, value);
    };
  }

  /**
   *
   */
  function isEditDisabled(schema, key) {
    return ['_id', '__v'].indexOf(key) !== -1 || !schema[key] || schema[key].disableEdit;
  }

  /**
   *
   * @param model
   */
  function getModelAsObject(model) {
    return model && model.toObject();
  }

  /**
   *
   * @param schema
   * @returns {*}
   */
  function getDefaultItem(schema) {
    return (0, _lodash2['default'])(schema.definition).map(getSchemaPropertyDefault).filter().reduce(_lodash2['default'].merge) || {};
  }

  /**
   * TODO how to set a default as a function -> need to check cmeasy model
   */
  function getSchemaPropertyDefault(schema, key) {

    if (key === '_cmeasyInstanceId') {
      return _defineProperty({}, key, _uuid2['default'].v4());
    } else if (key === 'dateCreated') {
      return _defineProperty({}, key, Date.now());
    } else {
      return _defineProperty({}, key, schema && typeof schema['default'] === 'function' ? schema['default']() : schema['default']);
    }
  }

  /**
   * Gets the history of an item
   *
   */
  function history(id) {
    return getModelSchema().then(function (schema) {
      return model.getModel().find(getIdQuery(id, schema)).sort(getSortQuery()).exec();
    });
  }

  /**
   * Deletes a Generated from the DB
   *
   */
  function destroy(id) {
    return getModelSchema().then(function (schema) {
      return model.getModel().find(getIdQuery(id, schema)).exec().then(destroyAll);
    });
  }

  /**
   *
   */
  function getIdQuery(id, schema) {
    if (isSchemaSingleton(schema)) {
      return _defineProperty({}, model.getIdKey(), id);
    } else {
      return _defineProperty({}, model.getInstanceKey(), id);
    }
  }

  /**
   *
   */
  function getSortQuery() {
    return { 'dateCreated': -1 };
  }

  /**
   *
   * @param item
   * @returns {*}
   */
  function destroyAll(items) {
    return _bluebird2['default'].all((0, _lodash2['default'])(items).map(function (item) {
      return item.remove();
    }).value());
  }

  /**
   *
   */
  function getUniqueIds(model, schema) {
    return function (entity) {

      if (isSchemaSingleton(schema)) {
        return (0, _lodash2['default'])(entity).map(function (item) {
          return item.toObject();
        }).uniq(model.getIdKey()).value();
      } else {
        return (0, _lodash2['default'])(entity).map(function (item) {
          return item.toObject();
        }).uniq(model.getInstanceKey()).value();
      }
    };
  }

  /**
   *
   *
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
   *
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
   *
   * @returns {string[]}
   */
  function getCleanProperties() {
    return ['_id', '__v', 'author', 'comment', 'dateCreated'];
  }
};

module.exports = exports['default'];
//# sourceMappingURL=cmeasy.controller.model.js.map
