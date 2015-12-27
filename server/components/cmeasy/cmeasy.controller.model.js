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
import uuid from 'uuid';

/**
 *
 * TODO catch and rethrow for ensured logging
 */
export default function(model, schemaController){

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
    return model.getModel().find({})
      .sort(getSortQuery()).execAsync()
      .then(getUniqueIds(model));
  }


  /**
   * Gets a single Generated from the DB
   *
   */
  function show(id) {
    //TODO add limit(1) here? Does it make a difference?

    //TODO for non-singletons we need to search a different property

    console.log(`Model:Show:Start:${model.getId()}:${id}`);

    return model.getModel().find(getIdQuery(id)).sort(getSortQuery()).execAsync()
      .then(function(items){
        //if this item is a singleton and there isn't one -> go and create it
        if(model.isSingleton() && (! items || items.length === 0)){
          return create({});
        }
        else {
          return _(items).first();
        }
      })
      .then(function(item){
        console.log(`Model:Show:Finish:${model.getId()}:${id}:${item}`);
        return item;
      });
  }


  /**
   * Creates a new Generated in the DB
   *
   */
  function create(item = {}) {

    console.log(`Model:Create:Start:${model.getId()}:${item[model.getInstanceKey()] || ''}:${item || ''}`);

    return Promise.all(getCreateResolve(item))
      .then(function([schema, currentItem]){
        return model.getModel().createAsync(getCreateItem(schema, item, currentItem));
      })
      .then(function(createdItem){
        console.log(`Model:Create:Finish:${model.getId()}:${item[model.getInstanceKey()] || ''}:${createdItem || ''}`);
        return createdItem;
      });

  }

  /**
   *
   */
  function getCreateResolve(item){
    var resolve = [ schemaController.show(model.getId()).then(getSchemaDefinition) ];

    //If the model is not a singleton then we need to go fetch the previous instance (if one exists)
    if( ! model.isSingleton() && item[model.getInstanceKey()]){
      resolve.push(show(item[model.getInstanceKey()])
        .then(getModelAsObject));
    }
    return resolve;
  }

  /**
   *
   * @returns {Object}
   */
  function getCreateItem(schema, item, currentItem = {}){
    return _.merge(getDefaultItem(schema), getStrippedCurrentItem(currentItem), getValidItem(schema, item));
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
   */
  function getStrippedCurrentItem(currentItem){
    return _.omit(currentItem, ['_id', '__v', 'author', 'dateCreated', 'comment']);
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
   * @param model
   */
  function getModelAsObject(model){
    return model.toObject();
  }

  /**
   *
   * @param model
   */
  function getSchemaDefinition(schema){
    return schema.definition;
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
   * TODO how to set a default as a function -> need to check cmeasy model
   */
  function getSchemaPropertyDefault(schema, key){

    if(key === '_cmeasyInstanceId'){
      return { [key]: uuid.v4() };
    }
    else if(key === 'dateCreated'){
      return { [key]: Date.now() };
    }
    else {
      return { [key]: schema && typeof schema.default === 'function' ? schema.default() : schema.default };
    }

  }

  /**
   * Gets the history of an item
   *
   */
  function history(id) {
    return model.getModel().find(getIdQuery(id)).sort(getSortQuery()).execAsync();
  }


  /**
   * Deletes a Generated from the DB
   *
   */
  function destroy(id) {
    return model.getModel().find(getIdQuery(id)).execAsync().then(destroyAll);
  }


  /**
   *
   */
  function getIdQuery(id){

    if(model.isSingleton()){
      return { [model.getIdKey()]: id };
    }
    else {
      return { [model.getInstanceKey()]: id };
    }

  }

  /**
   *
   */
  function getSortQuery(){
    return { 'dateCreated': -1 };
  }

  /**
   *
   * @param item
   * @returns {*}
   */
  function destroyAll(items){
    return Promise.all(_(items).map((item) => {return item.removeAsync();}).value());
  }

}


/**
 *
 */
function getUniqueIds(model){
  return function (entity) {

    if(model.isSingleton()){
      return _(entity)
        .map((item)=>{ return item.toObject(); })
        .uniq(model.getIdKey())
        .value();
    }
    else {
      return _(entity)
        .map((item)=>{ return item.toObject(); })
        .uniq(model.getInstanceKey())
        .value();
    }
  };
}

