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
import uuid from 'uuid';
import Promise from 'bluebird';
import {getSchemaShowQuery, getSchemaSortQuery} from './cmeasy.functions';
const debug = require('debug')('cmeasy:controller:schema');

export default function (cmeasy) {

  return {
    index: index,
    create: create,
    show: show,
    history: history,
    destroy: destroy
  };

  /**
   * Gets a list of Generateds
   */
  function index() {
    return cmeasy.getSchema()
      .find({})
      .sort(getSchemaSortQuery())
      .exec()
      .then(getUniqueIds(cmeasy))
      .then(removeMetaSchema(cmeasy));
  }

  /**
   * Gets a single Generated from the DB
   */
  function show(id) {
    debug(`show:start:${id}`);

    return cmeasy.getSchema()
      .find(getSchemaShowQuery(id))
      .sort(getSchemaSortQuery())
      .exec()
      .then(function (items) {
        return _(items)
          .first();
      })
      .then(function (item = {}) {
        debug(`show:finish:${id}:${item}`);
        return item;
      });
  }

  /**
   * Creates a new Generated in the DB
   */
  function create(item) {

    debug(`Schema:Create:Start:${item.meta && item.meta._cmeasyId}`);

    //TODO If there is no schema id then explode??

    var itemId = getIdFromItem(item, cmeasy);

    if (!itemId) {
      console.error('No type passed to create schema');
      return Promise.reject(new Error(400));
    }
    //If id === metaSchema the reject
    else if (itemId === cmeasy.getSchemaMetaId()) {
      console.error('Attempted to create meta schema');
      return Promise.reject(new Error(400));
    }

    return cmeasy.getSchema()
      .create(getDefaultSchema(cmeasy, item))
      .then(function (item) {
        debug(`create:finish:${item.meta && item.meta._cmeasyId}`);
        return item;
      });
  }

  /**
   * Gets the history of an item
   */
  function history(id) {
    return cmeasy.getSchema()
      .find(getSchemaShowQuery(id))
      .sort(getSchemaSortQuery())
      .exec();
  }

  /**
   * Deletes a Schema from the DB
   */
  function destroy(id) {
    return cmeasy.getSchema()
      .find(getSchemaShowQuery(id))
      .exec()
      .then(destroyAll);
  }

  /**
   * @param item
   * @returns {*}
   */
  function destroyAll(items) {
    return Promise.all(_(items)
      .map((item) => {
        return item.remove();
      })
      .value());
  }

  /**
   * TODO api check on definition
   */
  function getDefaultSchema(
    cmeasy,
    item
  ) {
    return {
      meta: _.omit(item.meta, ['dateCreated', 'author', 'comment']), //TODO we should be filtering the values in here using isSchemaEditDisabled
      definition: _.merge(item.definition, getBaseSchema(cmeasy, item))
    };
  }

  /**
   * TODO use this to protect some of the core meta properties
   */
  function isSchemaEditDisabled(
    schema,
    key
  ) {
    return ['_id', '__v'].indexOf(key) !== -1 || !schema[key] || schema[key].disableSchemaEdit;
  }

  /**
   * TODO this should be grabbed from the meta schema meta?
   * TODO create public content types that can be submitted to
   */
  function getBaseSchema(
    cmeasy,
    item
  ) {
    return {
      dateCreated: {
        type: 'Date',
        default: Date.now,
        disableEdit: true,
        disableSchemaEdit: true,
        disableDisplay: true,
        unique: false,
        required: true
      },
      author: {
        type: 'String',
        default: 'Server',
        disableEdit: true,
        disableSchemaEdit: true,
        disableDisplay: true,
        unique: false
      },
      comment: {
        type: 'String',
        default: 'Server',
        disableEdit: false,
        disableSchemaEdit: true,
        disableDisplay: true,
        unique: false
      },
      [cmeasy.getIdKey()]: {
        type: 'String',
        default: getIdFromItem(item, cmeasy),
        disableEdit: true,
        disableSchemaEdit: true,
        disableDisplay: true,
        unique: false,
        required: true
      },
      [cmeasy.getInstanceKey()]: {
        type: 'String',
        default: () => uuid.v4(),
        disableEdit: true,
        disableSchemaEdit: true,
        disableDisplay: true,
        unique: false,
        required: true
      }
    }
  }

}

function getIdFromItem(
  item,
  cmeasy
) {
  return item && item.meta && item.meta[cmeasy.getIdKey()];
}

function getUniqueIds(cmeasy) {
  return function (entity) {
    return _(entity)
      .map((item) => {
        return item.toObject();
      })

      // TODO this seems to be failing when upgrading to lodash 4.0.0?
      .uniq('meta.' + cmeasy.getIdKey())
      .value();

  };
}

function removeMetaSchema(cmeasy) {
  return function (items = []) {
    return _([].concat(items))
      .filter(isMetaSchema(cmeasy))
      .value();
  }
}

function isMetaSchema(cmeasy) {
  return function (item) {
    return !item.meta || item.meta[cmeasy.getIdKey()] !== cmeasy.getSchemaMetaId();
  }
}
