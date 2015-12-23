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


/**
 * TODO rename to controller.model
 */
export default function(model){

  var mongoModel = model.getModel();

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
   * TODO if singleton then return an object not an array
   */
  function index() {
    return mongoModel.find({})
      .sort(getSortQuery()).execAsync()
      .then(getUniqueIds(model));
  }


  /**
   * Gets a single Generated from the DB
   *
   */
  function show(id) {
    //TODO add limit(1) here? Does it make a difference?
    return mongoModel.find(getIdQuery(id)).sort(getSortQuery()).execAsync()
      .then(function(items){
        //if this item is a singleton and there isn't one -> go and create it
        if(model.isSingleton() && (! items || items.length === 0)){
          return create({});
        }
        else {
          return _(items).first();
        }
      });
  }


  /**
   * Creates a new Generated in the DB
   *
   */
  function create(item = {}) {

    //TODO validate value types from schema

    return model.getSchemaController()
      .show(model.getId())
      .then(function(schema){
          return mongoModel.createAsync(getCreateItem(schema, item));
        });

  }

  /**
   *
   * @param schema
   * @param item
   * @returns {Object}
   */
  function getCreateItem(schema, item){
    return _.merge(getDefaultItem(schema), getValidItem(schema, item));
  }

  /**
   *
   * @param schema
   * @param item
   */
  function getValidItem(schema, item){
    return _(item).map(getValidItemProperty(schema))
      .filter()
      .reduce(_.merge) || {};
  }

  /**
   *
   * @param value
   * @param key
   */
  function getValidItemProperty(schema){
    return function(value, key){

      //TODO test to make sure schema[key].type === value.prototype or something along those lines

      return isEditDisabled(schema, key) ? {[key]: undefined } : {[key]: value};
    }
  }

  /**
   *
   */
  function isEditDisabled(schema, key){
    return ['_id', '__v'].indexOf(key) !== -1 || schema[key].disableEdit;
  }



  /**
   *
   * @param schema
   * @returns {*}
   */
  function getDefaultItem(schema){
    return _(schema).map(getSchemaPropertyDefault)
      .filter()
      .reduce(_.merge) || {};
  }

  /**
   *
   * @param schema
   * @param key
   */
  function getSchemaPropertyDefault(schema, key){
    return { [key]: schema.default && typeof schema.default === 'function' ? schema.default() : schema.default };
  }


  /**
   * Gets the history of an item
   *
   */
  function history(id) {
    return mongoModel.find(getIdQuery(id)).sort(getSortQuery()).execAsync()
      .then(function(history){
        console.log('history', id, history);
        return history;
      });
  }


  /**
   * Deletes a Generated from the DB
   *
   */
  function destroy(id) {

    //TODO implement?
    return mongoModel.find(getIdQuery(id)).execAsync().removeAsync();
  }


  /**
   *
   */
  function getIdQuery(id){
    return { [model.getIdKey()]: id };
  }

  /**
   *
   */
  function getSortQuery(){
    return { 'dateCreated': -1 };
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

