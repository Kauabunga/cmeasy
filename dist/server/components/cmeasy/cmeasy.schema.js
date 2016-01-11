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

exports['default'] = function (namespace, mongoose, cmeasy) {
  var schemaModel = createMongooseModel(namespace, mongoose, cmeasy);

  addMetaSchema(schemaModel, cmeasy);

  return schemaModel;
};

/**
 *
 */
function createMongooseModel(namespace, mongoose, cmeasy) {
  return mongoose.model(getMongoSchemaName(namespace, cmeasy), new mongoose.Schema(getSchemaType(cmeasy), getOptions()));
}

/**
 *
 */
function getSchemaType(cmeasy) {
  return {
    meta: getMetaType(cmeasy),
    definition: {}
  };
}

/**
 *
 * Defines both the mongoose Schema.meta types and the MetaSchema.definition.meta instance
 *
 * TODO reuse this for defaulting a new Schema.meta values
 *
 */
function getMetaType(cmeasy) {
  var _ref;

  return _ref = {}, _defineProperty(_ref, cmeasy.getIdKey(), {
    $type: String,
    displayColumn: true,
    disableEdit: false, //Note this is a special case where when creating we do allow it to be edited
    label: 'Schema Id',
    required: true
  }), _defineProperty(_ref, 'dateCreated', {
    $type: Number,
    'default': Date.now,
    disableEdit: true
  }), _defineProperty(_ref, 'author', {
    $type: String,
    'default': 'Server default',
    disableEdit: true
  }), _defineProperty(_ref, 'comment', {
    $type: String,
    'default': 'Server seed',
    disableEdit: false,
    disableDisplay: true
  }), _defineProperty(_ref, 'singleton', {
    $type: Boolean,
    'default': false,
    disableEdit: false
  }), _defineProperty(_ref, 'disableDelete', {
    $type: Boolean,
    'default': false,
    disableEdit: false
  }), _defineProperty(_ref, 'disableCreate', {
    $type: Boolean,
    'default': false,
    disableEdit: false
  }), _ref;
}

/**
 *
 */
function getOptions() {
  return {
    strict: false,
    typeKey: '$type'
  };
}

/**
 * Meta Schema defining schema structure/definition
 */
function addMetaSchema(schemaModel, cmeasy) {
  schemaModel.createAsync(getMetaSchema(cmeasy));
  return schemaModel;
}

/**
 *
 */
function getMongoSchemaName(namespace, cmeasy) {
  return getSafeName(namespace) + '_Schema_' + cmeasy.getSchemaMetaId();
}

/**
 *
 * @param name
 */
function getSafeName(name) {
  return _lodash2['default'].camelCase((name || '').toString().replace(/\s/g, ''));
}

/**
 * Replace all $type references with type
 */
function getMetaSchemaType(cmeasy) {
  return (0, _lodash2['default'])(getMetaType(cmeasy)).map(function (item, key) {
    return _defineProperty({}, key, _lodash2['default'].merge(_lodash2['default'].omit(item, '$type'), { type: getPrototypeName(item.$type) }));
  }).reduce(_lodash2['default'].merge);
}

/**
 *
 * @param prototype
 * @returns {*}
 */
function getPrototypeName(prototype) {
  if (typeof prototype.name !== 'undefined') {
    return prototype.name;
  } else {
    return (/function (.+)\(/.exec(prototype.toString())[1]
    );
  }
}

/**
 *
 * @param model
 */
function getMetaSchema(cmeasy) {
  return {

    meta: _defineProperty({
      dateCreated: Date.now(),
      author: 'Server',
      comment: 'Initial seed'
    }, cmeasy.getIdKey(), cmeasy.getSchemaMetaId()),

    definition: {
      meta: getMetaSchemaType(cmeasy),
      definition: {
        type: '__schemaType__'
      }
    }
  };
}
module.exports = exports['default'];
//# sourceMappingURL=cmeasy.schema.js.map
