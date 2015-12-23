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
export default function(model){

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
    return model.getSchema().find({})
      .sort(getSchemaSortQuery()).execAsync()
      .then(getUniqueIds(model));
  }


  /**
   * Gets a single Generated from the DB
   *
   */
  function show(id) {

    return model.getSchema().find(getSchemaShowQuery(id)).sort(getSchemaSortQuery()).execAsync()
      .then(function(items){
        if(! items || items.length === 0){
          return create({});
        }
        else {
          return _(items).first();
        }
      });
  }


  /**
   * Creates a new Generated in the DB
   * TODO....
   */
  function create(item) {

    return model.getSchema().createAsync(_.merge(item || {}, getDefaultSchema(model)))
      .then(getDefinitionFromSchema);
  }


  /**
   * Gets the history of an item
   *
   */
  function history(id) {
    return Promise.reject(new Error(501));
  }


  /**
   * Deletes a Generated from the DB
   *
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
    return {
      meta: { [model.getIdKey()]: id }
    }
  }


  /**
   * TODO api check on definition
   */
  function getDefaultSchema(model){
    return {
      meta: getSchemaMeta(model),
      definition: _.merge(model.getDefinition(), getBaseSchema(model))
    };
  }

  /**
   *
   */
  function getSchemaMeta(model){
    return {
      dateCreated: new Date(),
      author: 'Server',
      [model.getIdKey()]: model.getId()
    }
  }

  /**
   *
   */
  function getBaseSchema(model){
    return {

      dateCreated: {
        type: Date,
        default: new Date(),
        disableEdit: true,
        unique: false
      },

      //TODO create public content types that can be submitted to
      author: {
        type: String,
        default: 'Server',
        disableEdit: true,
        unique: false
      },

      [model.getIdKey()]: {
        type: String,
        default: getDefaultId(model),
        disableEdit: true,
        unique: false
      }
    }
  }




}

/**
 *
 */
function getDefinitionFromSchema(schema){

  //TODO handle if typeof array
  return schema.definition;
}

/**
 *
 */
function getDefaultId(model){
  return function(){
    if(model.isSingleton()){
      return model.getId();
    }
    else {
      return uuid.v4();
    }
  }
}


/**
 *
 */
function getUniqueIds(model){
  return function (entity) {
    return _(entity).unique(model.getIdKey()).value();
  };
}

