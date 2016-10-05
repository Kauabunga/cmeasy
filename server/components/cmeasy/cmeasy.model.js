'use strict';

import _ from 'lodash';
const R = require('ramda');

export default function(cmeasy, mongoose, model) {
  let mongooseModel;
  if (R.contains(getMongoModelName(cmeasy.getNamespace(), model), mongoose.modelNames())) {
    mongooseModel = mongoose.model(getMongoModelName(cmeasy.getNamespace(), model));
  } else {
    mongooseModel = mongoose.model(
      getMongoModelName(cmeasy.getNamespace(), model),
      new mongoose.Schema({}, getOptions())
    );
  }

  // Remove any dud models from the db
  cleanModel(cmeasy, mongooseModel);

  return mongooseModel;
}

function cleanModel(cmeasy, model) {
  return model.find({})
    .exec()
    .then(removeModelsWithoutProperty(cmeasy.getIdKey()))
    .then(removeModelsWithoutProperty(cmeasy.getInstanceKey()));
}

function getOptions() {
  return {
    strict: false,
    typeKey: '$type'
  };
}

function getMongoModelName(namespace, model) {
  return `${getSafeName(namespace)}_Model_${model.getId()}`;
}

/**
 * @param name
 */
function getSafeName(name) {
  return _.camelCase((name || '').toString().replace(/\s/g, ''));
}

function removeModelsWithoutProperty(property) {
  return function(items) {
    return _(items).map(function(item) {
      if (!item[property] || item[property] === '') {
        item.remove();
        return undefined;
      }
      else {
        return item;
      }
    }).filter().value;
  }
}
