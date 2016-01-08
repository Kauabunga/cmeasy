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

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

/**
 *
 */

exports['default'] = function (cmeasy) {

  return {
    index: index,
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
    return cmeasy.getSchema().find({}).sort(getSchemaSortQuery()).execAsync().then(getUniqueIds(cmeasy)).then(removeMetaSchema(cmeasy));
  }

  /**
   * Gets a single Generated from the DB
   *
   */
  function show(id) {

    console.log('Schema:Show:Start:' + id);

    return cmeasy.getSchema().find(getSchemaShowQuery(id)).sort(getSchemaSortQuery()).execAsync().then(function (items) {
      return (0, _lodash2['default'])(items).first();
    }).then(function () {
      var item = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      console.log('Schema:Show:Finish:' + id + ':' + item);
      return item;
    });
  }

  /**
   * Creates a new Generated in the DB
   *
   */
  function create(item) {

    console.log('Schema:Create:Start:' + (item.meta && item.meta._cmeasyId));

    //TODO If there is no schema id then explode??

    var itemId = getIdFromItem(item, cmeasy);

    if (!itemId) {
      console.error('No type passed to create schema');
      return _bluebird2['default'].reject(new Error(400));
    }
    //If id === metaSchema the reject
    else if (itemId === cmeasy.getSchemaMetaId()) {
        console.error('Attempted to create meta schema');
        return _bluebird2['default'].reject(new Error(400));
      }

    return cmeasy.getSchema().createAsync(getDefaultSchema(cmeasy, item)).then(function (item) {
      console.log('Schema:Create:Finish:' + (item.meta && item.meta._cmeasyId));
      return item;
    });
  }

  /**
   * Gets the history of an item
   *
   */
  function history(id) {
    return cmeasy.getSchema().find(getSchemaShowQuery(id)).sort(getSchemaSortQuery()).execAsync();
  }

  /**
   * Deletes a Schema from the DB
   */
  function destroy(id) {
    return cmeasy.getSchema().find(getSchemaShowQuery(id)).execAsync().then(destroyAll);
  }

  /**
   *
   * @param item
   * @returns {*}
   */
  function destroyAll(items) {
    return _bluebird2['default'].all((0, _lodash2['default'])(items).map(function (item) {
      return item.removeAsync();
    }).value());
  }

  /**
   *
   */
  function getSchemaSortQuery() {
    return { 'meta.dateCreated': -1 };
  }

  /**
   * TODO get by _cmeasyInstanceId so the _cmeasyId can be changed
   *
   * @param id
   */
  function getSchemaShowQuery(id) {
    return { 'meta._cmeasyId': id };
  }

  /**
   * TODO api check on definition
   */
  function getDefaultSchema(cmeasy, item) {
    return {
      meta: _lodash2['default'].omit(item.meta, ['dateCreated', 'author', 'comment']), //TODO we should be filtering the values in here using isSchemaEditDisabled
      definition: _lodash2['default'].merge(item.definition, getBaseSchema(cmeasy, item))
    };
  }

  /**
   * TODO use this to protect some of the core meta properties
   */
  function isSchemaEditDisabled(schema, key) {
    return ['_id', '__v'].indexOf(key) !== -1 || !schema[key] || schema[key].disableSchemaEdit;
  }

  /**
   * TODO this should be grabbed from the meta schema meta?????
   *
   * TODO create public content types that can be submitted to
   */
  function getBaseSchema(cmeasy, item) {
    var _ref;

    return _ref = {

      dateCreated: {
        type: 'Date',
        'default': Date.now,
        disableEdit: true,
        disableSchemaEdit: true,
        disableDisplay: true,
        unique: false,
        required: true
      },

      author: {
        type: 'String',
        'default': 'Server',
        disableEdit: true,
        disableSchemaEdit: true,
        disableDisplay: true,
        unique: false
      },

      comment: {
        type: 'String',
        'default': 'Server',
        disableEdit: false,
        disableSchemaEdit: true,
        disableDisplay: true,
        unique: false
      }

    }, _defineProperty(_ref, cmeasy.getIdKey(), {
      type: 'String',
      'default': getIdFromItem(item, cmeasy),
      disableEdit: true,
      disableSchemaEdit: true,
      disableDisplay: true,
      unique: false,
      required: true
    }), _defineProperty(_ref, cmeasy.getInstanceKey(), {
      type: 'String',
      'default': function _default() {
        return _uuid2['default'].v4();
      },
      disableEdit: true,
      disableSchemaEdit: true,
      disableDisplay: true,
      unique: false,
      required: true
    }), _ref;
  }
};

/**
 *
 */
function getIdFromItem(item, cmeasy) {
  return item && item.meta && item.meta[cmeasy.getIdKey()];
}

/**
 *
 */
function getUniqueIds(cmeasy) {
  return function (entity) {
    return (0, _lodash2['default'])(entity).map(function (item) {
      return item.toObject();
    }).uniq('meta.' + cmeasy.getIdKey()).value();
  };
}

/**
 *
 */
function removeMetaSchema(cmeasy) {
  return function () {
    var items = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    return (0, _lodash2['default'])([].concat(items)).filter(isMetaSchema(cmeasy)).value();
  };
}

/**
 *
 */
function isMetaSchema(cmeasy) {
  return function (item) {
    return !item.meta || item.meta[cmeasy.getIdKey()] !== cmeasy.getSchemaMetaId();
  };
}
module.exports = exports['default'];
//# sourceMappingURL=cmeasy.controller.schema.js.map
