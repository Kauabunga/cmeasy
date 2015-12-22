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
import {Promise} from 'bluebird';


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
  function index(req, res) {
    return model.getDao().index()
      .then(responseWithResult(res))
      .catch(handleError(res));
  }


  /**
   * Gets a single Generated from the DB
   *
   */
  function show(req, res) {
    return model.getDao().show(req.params.id)
      .then(handleEntityNotFound(res))
      .then(responseWithResult(res))
      .catch(handleError(res));
  }


  /**
   * Creates a new Generated in the DB
   *
   */
  function create(req, res) {
    return model.getDao().create(req.body)
      .then(responseWithResult(res, 201))
      .catch(handleError(res));
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
  function destroy(req, res) {
    return model.getDao().destroy(req.params.id)
      .then(handleEntityNotFound(res))
      .then(removeEntity(res))
      .catch(handleError(res));
  }

}



/**
 *
 */
function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}


function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}