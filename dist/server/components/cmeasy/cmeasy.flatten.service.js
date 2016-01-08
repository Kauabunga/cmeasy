

'use strict';

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _flat = require('flat');

var _flat2 = _interopRequireDefault(_flat);

/**
 *
 */
exports['default'] = flatten;

/**
 *
 * @param schema
 * @returns {*}
 */
function flatten(schema) {

  return (0, _lodash2['default'])((0, _flat2['default'])(schema, { maxDepth: 0 })).map(parseFlattenPaths).filter().map(getDefinitionsFromPaths(schema)).filter().reduce(_lodash2['default'].merge);
}

/**
 *
 */
function getDefinitionsFromPaths(schema) {
  return function (path) {
    var definition = _lodash2['default'].merge({ path: path }, _lodash2['default'].get(schema, path));
    if (definition.type instanceof Array) {
      return _defineProperty({}, path, _lodash2['default'].merge(definition, { type: flatten(definition.type[0] || {}) }));
    } else {
      return _defineProperty({}, path, definition);
    }
  };
}

/**
 *
 * @param key
 */
function parseFlattenPaths(path, key) {

  var typeIndex = '.type';

  if (key.indexOf(typeIndex)) {
    return key.substring(0, key.indexOf(typeIndex));
  } else {
    return undefined;
  }
}
module.exports = exports['default'];
//# sourceMappingURL=cmeasy.flatten.service.js.map
