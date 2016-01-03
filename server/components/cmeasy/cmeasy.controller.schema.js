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

/**
 *
 */
export default function(cmeasy){

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
    return cmeasy.getSchema().find({})
      .sort(getSchemaSortQuery()).execAsync()
      .then(getUniqueIds(cmeasy))
      .then(removeMetaSchema(cmeasy));
  }


  /**
   * Gets a single Generated from the DB
   *
   */
  function show(id) {

    console.log(`Schema:Show:Start:${id}`);

    return cmeasy.getSchema().find(getSchemaShowQuery(id)).sort(getSchemaSortQuery()).execAsync()
      .then(function(items){
        return _(items).first();
      })
      .then(getDefinitionFromSchema)
      .then(function(item){
        console.log(`Schema:Show:Finish:${id}:${item}`);
        return item;
      });
  }


  /**
   * Creates a new Generated in the DB
   *
   */
  function create(item) {

    console.log(`Schema:Create:Start:${item.meta && item.meta._cmeasyId}`);

    //TODO If there is no schema id then explode??

    var itemId = getIdFromItem(item, cmeasy);

    if( ! itemId){
      console.error('No type passed to create schema');
      return Promise.reject(new Error(400));
    }
    //If id === metaSchema the reject
    else if(itemId === cmeasy.getSchemaMetaId()){
      console.error('Attempted to create meta schema');
      return Promise.reject(new Error(400));
    }

    return cmeasy.getSchema()
      .createAsync(getDefaultSchema(cmeasy, item))
      .then(getDefinitionFromSchema)
      .then(function(item){
        console.log(`Schema:Create:Finish:${item.meta && item.meta._cmeasyId}`);
        return item;
      });
  }


  /**
   * Gets the history of an item
   *
   */
  function history(id) {
    return cmeasy.getSchema()
      .find(getSchemaShowQuery(id))
      .sort(getSchemaSortQuery())
      .execAsync();
  }


  /**
   * Deletes a Schema from the DB
   * TODO implmeent
   */
  function destroy(id) {
    return Promise.reject(new Error(501));
  }



  /**
   *
   */
  function getSchemaSortQuery(){
    return { 'meta.dateCreated': -1 };
  }


  /**
   *
   * @param id
   * @returns {{meta: {}}}
   */
  function getSchemaShowQuery(id){
    return {'meta._cmeasyId': id}
  }


  /**
   * TODO api check on definition
   */
  function getDefaultSchema(cmeasy, item){
    return {
      meta: _.omit(item.meta, ['dateCreated', 'author', 'comment']), //TODO we should be filtering the values in here using isSchemaEditDisabled
      definition: _.merge(item.definition, getBaseSchema(cmeasy, item))
    };
  }


  /**
   * TODO use this to protect some of the core meta properties
   */
  function isSchemaEditDisabled(schema, key){
    return ['_id', '__v'].indexOf(key) !== -1 || ! schema[key] || schema[key].disableSchemaEdit;
  }



  /**
   * TODO this should be grabbed from the meta schema meta?????
   *
   * TODO create public content types that can be submitted to
   */
  function getBaseSchema(cmeasy, item){

    return {

      dateCreated: {
        type: 'Date',
        default: Date.now,
        disableEdit: true,
        disableSchemaEdit: true,
        disableDisplay: true,
        unique: false
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
        unique: false
      },

      [cmeasy.getInstanceKey()]: {
        type: 'String',
        default: () => uuid.v4(),
        disableEdit: true,
        disableSchemaEdit: true,
        disableDisplay: true,
        unique: false
      }

    }
  }

}

/**
 *
 */
function getIdFromItem(item, cmeasy){
  return item && item.meta && item.meta[cmeasy.getIdKey()];
}

/**
 *
 */
function getDefinitionFromSchema(schema){
  return schema;
}

/**
 *
 */
function getUniqueIds(cmeasy){
  return function (entity) {
    return _(entity)
      .map((item)=>{ return item.toObject(); })
      .uniq('meta.' + cmeasy.getIdKey())
      .map(getDefinitionFromSchema)
      .value();

  };
}

/**
 *
 */
function removeMetaSchema(cmeasy){
  return function (items = []){
    return _([].concat(items)).filter(isMetaSchema(cmeasy)).value();
  }
}

/**
 *
 */
function isMetaSchema(cmeasy){
  return function (item){
    return ! item.meta || item.meta[cmeasy.getIdKey()] !== cmeasy.getSchemaMetaId();
  }
}


