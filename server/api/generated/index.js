
'use strict';


import express from 'express';
import config from '../../config/environment';
import createCrudController from './generated.controller.crud';
import _ from 'lodash';


/**
 *
 */
module.exports = function(model){
  //TODO user the Router as passed in via options
  return createModelRoute(model, express.Router());
};


/**
 *
 * @param router
 * @returns {Function}
 */
function createModelRoute(model, router){

  let crudController = createCrudController(model);

  router.get(`/${config.modelFormlyRoute}`, gettify(model.getFormly().createModelFormlyFields));
  router.get(`/${config.modelColumnRoute}`, gettify(model.getFormly().createModelColumns));

  router.get('/', crudController.index);
  router.get('/:id', crudController.show);
  router.post('/', crudController.create);
  router.put('/:id', crudController.create);
  router.patch('/:id', crudController.create);
  router.delete('/:id', crudController.destroy);

  return router;
}

/**
 *
 * @param fn
 * @returns {Function}
 */
function gettify(fn){
  return function(req, res){
    return res.status(200).send(fn());
  }
}
