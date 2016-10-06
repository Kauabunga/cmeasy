import uuid from 'uuid';
import _ from 'lodash';
import {getSchemaShowQuery, getSchemaSortQuery} from './cmeasy.functions';
const DEBUG_PREFIX = 'cmeasy:controller:model:functions';
const debug = require('debug')(DEBUG_PREFIX);

module.exports = {
  showInstance: showInstance,
  getSortQuery: getSortQuery,
  createInstance: createInstance,
  getModelSchema: getModelSchema,
  isSchemaSingleton: isSchemaSingleton,
  getIdQuery: getIdQuery
};

function createInstance(
  cmeasy,
  model,
  item
) {
  return getCreateResolve(cmeasy, model, item)
    .then(function ([schema, currentItem]) {
      return model.getModel()
        .create(getCreateItem(schema, item, currentItem));
    })
    .then(function (createdItem) {
      debug(`createdInstance:finish:${model.getId()}:${JSON.stringify(item[model.getInstanceKey()] || '')}:${JSON.stringify(createdItem || '')}`);
      return createdItem;
    });
}

function getCreateResolve(
  cmeasy,
  model,
  item
) {
  return getModelSchema(cmeasy, model)
    .then(function (schema) {
      // If the model is not a singleton or it contains an instance key
      // then we need to go fetch the previous instance (if one exists)
      if (!isSchemaSingleton(schema) || item[model.getInstanceKey()]) {
        return showInstance(item[model.getInstanceKey()], model)
          .then(getModelAsObject)
          .then(function (currentItem = {}) {
            return [schema, currentItem];
          });
      } else {
        return [schema, {}];
      }
    });
}

function getCreateItem(
  schema,
  item,
  currentItem = {}
) {
  return _.merge(getDefaultItem(schema), getStrippedCurrentItem(currentItem), getValidItem(schema, item));
}

function getDefaultItem(schema) {
  return _(schema.definition)
      .map(getSchemaPropertyDefault)
      .filter()
      .reduce(_.merge) || {};
}

function isSchemaSingleton(schema) {
  return schema && schema.meta && schema.meta.singleton;
}

function getModelSchema(
  cmeasy,
  model
) {
  debug(`getModelSchema with model id ${model.getId()}`);
  return cmeasy
    .getSchema()
    .find(getSchemaShowQuery(model.getId()))
    .sort(getSchemaSortQuery())
    .exec()
    .then((items) => _(items).first())
    .then(function (item = {}) {
      debug(`show:finish:${model.getId()}:${JSON.stringify(item)}`);
      return item;
    });
}

function showInstance(
  id,
  model
) {
  return model.getModel()
    .find(getIdQuery(id, {
      meta: {
        singleton: false
      }
    }, model))
    .sort(getSortQuery())
    .exec()
    .then(function (items) {
      return _(items)
        .first();
    });
}

function getModelAsObject(model) {
  return model && model.toObject();
}

function getStrippedCurrentItem(currentItem) {
  return _.omit(currentItem, ['_id', '__v', 'author', 'dateCreated', 'comment']);
}

function getValidItem(
  schema,
  item
) {
  return _(item)
      .map(getValidItemProperty(schema.definition))
      .filter()
      .reduce(_.merge) || {};
}

function getValidItemProperty(schema) {
  return function (
    value,
    key
  ) {

    // TODO test to make sure schema[key].type === value.prototype or something along those lines
    return isEditDisabled(schema, key) ? {[key]: undefined} : {[key]: value};
  }
}

function getSchemaPropertyDefault(
  schema,
  key
) {
  if (key === '_cmeasyInstanceId') {
    return {[key]: uuid.v4()};
  } else if (key === 'dateCreated') {
    return {[key]: Date.now()};
  } else {
    return {[key]: schema && typeof schema.default === 'function' ? schema.default() : schema.default};
  }
}

function getSortQuery() {
  return {'dateCreated': -1};
}

function getIdQuery(
  id,
  schema,
  model
) {
  if (isSchemaSingleton(schema)) {
    return {[model.getIdKey()]: id};
  }
  else {
    return {[model.getInstanceKey()]: id};
  }
}

function isEditDisabled(
  schema,
  key
) {
  return ['_id', '__v'].indexOf(key) !== -1 || !schema[key] || schema[key].disableEdit;
}

