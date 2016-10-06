/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/generated              ->  index
 * POST    /api/generated              ->  create
 * GET     /api/generated/:id          ->  show
 * PUT     /api/generated/:id          ->  update
 * DELETE  /api/generated/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Promise from 'bluebird';
import {
  getSortQuery,
  showInstance,
  createInstance,
  getModelSchema,
  isSchemaSingleton,
  getIdQuery
} from './cmeasy.functions.models';
const debug = require('debug')('cmeasy:controller:model');

/**
 * TODO catch and rethrow for ensured logging
 */
export default function(model, cmeasy) {
  return {
    index: index,
    indexClean: _.flow(index, cleanObject),
    create: create,
    show: show,
    history: history,
    destroy: destroy
  };

  /**
   * Gets a list of Generateds
   */
  function index() {
    debug(`index`);
    return getModelSchema(cmeasy, model)
      .then((schema) => {
        if (isSchemaSingleton(schema)) {
          debug(`Returning singleton for ${model.getId()}`);
          return showSingleton(model.getId())
          // convert back into an array to keep consistency
            .then((singleton) => [].concat(singleton));
        }

        debug(`Returning list of models of id ${model.getId()}`);
        return model.getModel()
          .find({})
          .sort(getSortQuery()).exec()
          .then(getUniqueIds(model, schema));
      });
  }

  /**
   * Gets a single Generated from the DB
   */
  function show(id) {
    debug(`show:start getting: ${model.getId()} with id: ${id}`);
    return getModelSchema(cmeasy, model)
      .then((schema) => {
        debug(`show getModelSchema successful`);
        if (isSchemaSingleton(schema)) {
          debug(`show getModelSchema returning singleton`);
          return showSingleton(id);
        }

        debug(`show getModelSchema returning instance with id ${id}`);
        return showInstance(id, model);
      })
      .then(function(item) {
        debug(`show:finishing with model id: ${model.getId()}, called with id: ${id}, returning: ${item}`);
        return item;
      });
  }

  /**
   * @param id
   * @returns {*}
   */
  function showSingleton(id) {
    return model.getModel()
      .find(getIdQuery(id, {
        meta: {
          singleton: true
        }
      }, model))
      .sort(getSortQuery()).exec()
      .then(function(items) {
        // if this item is a singleton and there isn't one -> go and create it
        if (!items || items.length === 0) {
          return create({});
        } else {
          return _(items).first();
        }
      });
  }

  /**
   * Creates a new Generated in the DB
   */
  function create(item = {}) {
    return createInstance(cmeasy, model, item);
  }

  /**
   * Gets the history of an item
   */
  function history(id) {
    return getModelSchema(cmeasy, model)
      .then(function(schema) {
        return model.getModel()
          .find(getIdQuery(id, schema, model))
          .sort(getSortQuery()).exec();
      });
  }

  /**
   * Deletes a Generated from the DB
   */
  function destroy(id) {
    return getModelSchema(cmeasy, model)
      .then((schema) => {
        return model.getModel()
          .find(getIdQuery(id, schema, model))
          .exec().then(destroyAll);
      });
  }

  /**
   * @param items
   * @returns {*}
   */
  function destroyAll(items) {
    return Promise.all(_(items).map((item) => item.remove())
      .value());
  }

  function getUniqueIds(model, schema) {
    debug(`getUniqueIds`)
    return (entity) => {
      debug(`getUniqueIds with entity ${entity}`);
      if (isSchemaSingleton(schema)) {
        debug(`getUniqueIds entity is a singleton`);
        return _(entity)
          .map((item) => {
            return item.toObject();
          })
          .uniq(model.getIdKey())
          .value();
      }

      debug(`getUniqueIds entity is not a singleton`);
      return _(entity)
        .map((item) => {
          return item.toObject();
        })
        .uniq(model.getInstanceKey())
        .value();
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
      return _(item).map(function(singleItem) {
        if (typeof singleItem.toObject === 'function') {
          return _.omit(singleItem.toObject(), getCleanProperties());
        } else {
          return _.omit(singleItem, getCleanProperties());
        }
      }).value();
    } else {
      if (typeof item.toObject === 'function') {
        return _.omit(item.toObject(), getCleanProperties());
      } else {
        return _.omit(item, getCleanProperties());
      }
    }
  }

  /**
   * @returns {string[]}
   */
  function getCleanProperties() {
    return ['_id', '__v', 'author', 'comment', 'dateCreated'];
  }
}
