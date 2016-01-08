'use strict';

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

exports['default'] = function (cmeasy, mongoose, model) {
  var mongooseModel = mongoose.model(getMongoModelName(cmeasy.getNamespace(), model), new mongoose.Schema({}, getOptions()));

  //Remove any dud models from the db
  cleanModel(cmeasy, mongooseModel);

  return mongooseModel;
};

/**
 *
 */
function cleanModel(cmeasy, model) {
  return model.find({}).execAsync().then(removeModelsWithoutProperty(cmeasy.getIdKey())).then(removeModelsWithoutProperty(cmeasy.getInstanceKey()));
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
 *
 */
function getMongoModelName(namespace, model) {
  return getSafeName(namespace) + '_Model_' + model.getId();
}

/**
 *
 * @param name
 */
function getSafeName(name) {
  return _lodash2['default'].camelCase((name || '').toString().replace(/\s/g, ''));
}

/**
 *
 */
function removeModelsWithoutProperty(property) {
  return function (items) {
    return (0, _lodash2['default'])(items).map(function (item) {
      if (!item[property] || item[property] === '') {
        item.removeAsync();
        return undefined;
      } else {
        return item;
      }
    }).filter().value;
  };
}
module.exports = exports['default'];
//# sourceMappingURL=cmeasy.model.js.map
