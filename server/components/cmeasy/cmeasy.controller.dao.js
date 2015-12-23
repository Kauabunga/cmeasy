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
   */
  function index() {
    return mongoModel.find({})
      .sort({ dateCreated: -1 }).execAsync()
      .then(getUniqueIds(model));
  }


  /**
   * Gets a single Generated from the DB
   *
   */
  function show(id) {
    //TODO add limit(1) here?
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
  function create(item) {
    //TODO default values from schema
    //TODO validate values from schema
    //TODO validate disableEdit from schema
    return mongoModel.createAsync(item);
  }


  /**
   * Gets the history of an item
   *
   */
  function history(id) {
    return mongoModel.find(getIdQuery(id)).sort(getSortQuery()).execAsync();
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
    return {[model.getIdKey()]: id};
  }

  /**
   *
   */
  function getSortQuery(){
    return { dateCreated: -1 };
  }

}


/**
 *
 */
function getUniqueIds(model){
  return function (entity) {
    return _(entity).unique(model.idProperty).value();
  };
}

