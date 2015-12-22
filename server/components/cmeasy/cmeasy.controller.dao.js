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

export default function(originalModel){

  var mongoModel = originalModel.getMongoModel();

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
      .then(getUniqueIds(originalModel));
  }


  /**
   * Gets a single Generated from the DB
   *
   */
  function show(id) {
    return mongoModel.find({[originalModel.getIdKey()]: id}).sort({dateCreated: -1}).execAsync()
      .then(function(items){

        //if this item is a singleton and there isn't one -> go and create it
        if(originalModel.isSingleton() && (! items || items.length === 0)){
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
    return mongoModel.createAsync(item);
  }


  /**
   * Gets the history of an item
   *
   */
  function history(req, res) {
    return res.sendStatus(501);
  }


  /**
   * Deletes a Generated from the DB
   *
   */
  function destroy(id) {
    return mongoModel.findByIdAsync(id);
  }


}


/**
 *
 */
function getUniqueIds(originalModel){
  return function (entity) {
    return _(entity).unique(originalModel.idProperty).value();
  };
}

