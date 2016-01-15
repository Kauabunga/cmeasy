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
    indexClean: _.flow(index, cleanObject),
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
    return getModelSchema()
      .then(function(schema) {
        if(isSchemaSingleton(schema)){
          return showSingleton(model.getId())
            .then(function(singleton){
              //convert back into an array to keep consistency
              return [].concat(singleton);
            });
        }
        else {
          return model.getModel().find({})
            .sort(getSortQuery()).execAsync()
            .then(getUniqueIds(model, schema));
        }
      });
  }


  /**
   * Gets a single Generated from the DB
   *
   */
  function show(id) {

    console.log(`Model:Show:Start:${model.getId()}:${id}`);

    return getModelSchema()
      .then(function(schema){
        if(isSchemaSingleton(schema)){
          return showSingleton(id);
        }
        else {
          return showInstance(id);
        }
      })
      .then(function(item){
        console.log(`Model:Show:Finish:${model.getId()}:${id}:${item}`);
        return item;
      });
  }

  /**
   *
   * @param id
   * @returns {*}
   */
  function showSingleton(id){

    return model.getModel().find(getIdQuery(id, {meta: {singleton: true}})).sort(getSortQuery()).execAsync()
      .then(function(items){
        //if this item is a singleton and there isn't one -> go and create it
        if(! items || items.length === 0 ){
          return create({});
        }
        else {
          return _(items).first();
        }
      });
  }

  /**
   *
   * @param id
   * @param schema
   */
  function showInstance(id){
    return model.getModel().find(getIdQuery(id, {meta: {singleton: false}})).sort(getSortQuery()).execAsync()
      .then(function(items){
        return _(items).first();
      });
  }


  /**
   * Creates a new Generated in the DB
   *
   */
  function create(item = {}) {

    console.log(`Model:Create:Start:${model.getId()}:${item[model.getInstanceKey()] || ''}:${item || ''}`);

    return getCreateResolve(item)
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

    return getModelSchema()
      .then(function(schema){

        //If the model is not a singleton or it contains an instance key
        //then we need to go fetch the previous instance (if one exists)
        if( ! isSchemaSingleton(schema) || item[model.getInstanceKey()]){
          return showInstance(item[model.getInstanceKey()])
            .then(getModelAsObject)
            .then(function(currentItem = {}){
              return [schema, currentItem];
            });
        }
        else {
          return [schema, {}];
        }

      });

  }

  /**
   *
   * @returns {*}
   */
  function getModelSchema(){
    return schemaController.show(model.getId());
  }


  /**
   *
   */
  function isSchemaSingleton(schema){
    return schema && schema.meta && schema.meta.singleton;
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
    return _(item).map(getValidItemProperty(schema.definition))
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
    return ['_id', '__v'].indexOf(key) !== -1 || ! schema[key] || schema[key].disableEdit;
  }


  /**
   *
   * @param model
   */
  function getModelAsObject(model){
    return model && model.toObject();
  }

  /**
   *
   * @param schema
   * @returns {*}
   */
  function getDefaultItem(schema){
    return _(schema.definition).map(getSchemaPropertyDefault)
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
    return getModelSchema()
      .then(function(schema) {
        return model.getModel().find(getIdQuery(id, schema)).sort(getSortQuery()).execAsync();
      });
  }


  /**
   * Deletes a Generated from the DB
   *
   */
  function destroy(id) {
    return getModelSchema()
      .then(function(schema){
        return model.getModel().find(getIdQuery(id, schema)).execAsync().then(destroyAll);
      });


  }


  /**
   *
   */
  function getIdQuery(id, schema){
    if(isSchemaSingleton(schema)){
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



  /**
   *
   */
  function getUniqueIds(model, schema){
    return function (entity) {

      if(isSchemaSingleton(schema)){
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


  /**
   *
   *
   * @param item
   * @returns {*}
   */
  function cleanObject(item) {
    if(typeof item.then === 'function'){
      return item.then(_cleanObject);
    }
    else {
      return _cleanObject(item);
    }
  }

  /**
   *
   * @param item
   * @returns {*}
   * @private
   */
  function _cleanObject(item){

    if (item instanceof Array) {
      return _(item).map(function (singleItem) {
        if(typeof singleItem.toObject === 'function'){
          return _.omit(singleItem.toObject(), getCleanProperties());
        }
        else {
          return _.omit(singleItem, getCleanProperties());
        }
      }).value();
    }
    else {
      if(typeof item.toObject === 'function'){
        return _.omit(item.toObject(), getCleanProperties());
      }
      else {
        return _.omit(item, getCleanProperties());
      }

    }
  }

  /**
   *
   * @returns {string[]}
   */
  function getCleanProperties(){
    return ['_id', '__v', 'author', 'comment', 'dateCreated'];
  }



}
