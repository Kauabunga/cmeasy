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


/**
 * TODO rename to controller.model
 *
 * TODO catch and rethrow for ensured logging
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

    //TODO for non-singletons we need to search a different property

    console.log(`Show:Start:${model.getId()}:${id}`);

    return mongoModel.find(getIdQuery(id)).sort(getSortQuery()).execAsync()
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
        console.log(`Show:Finish:${model.getId()}:${id}:${item}`);
        return item;
      });
  }


  /**
   * Creates a new Generated in the DB
   *
   */
  function create(item = {}) {

    console.log(`Create:Start:${model.getId()}:${item[model.getInstanceKey()] || ''}:${item || ''}`);

    return Promise.all(getCreateResolve(item))
      .then(function([schema, currentItem]){
        return mongoModel.createAsync(getCreateItem(schema, item, currentItem));
      })
      .then(function(createdItem){
        console.log(`Create:Finish:${model.getId()}:${item[model.getInstanceKey()] || ''}:${createdItem || ''}`);
        return createdItem;
      });

  }

  /**
   *
   */
  function getCreateResolve(item){
    var resolve = [ model.getSchemaController().show(model.getId()) ];

    //If the model is not a singleton then we need to go fetch the previous instance (if one exists)
    if( ! model.isSingleton() && item[model.getInstanceKey()]){
      resolve.push(show(item[model.getInstanceKey()]).then(getModelAsObject));
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
   */
  function getSchemaPropertyDefault(schema, key){
    return { [key]: typeof schema.default === 'function' ? schema.default() : schema.default };
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
    return mongoModel.find(getIdQuery(id)).execAsync().then(destroyAll);
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
    return _(entity).unique(model.getIdKey()).value();
  };
}

