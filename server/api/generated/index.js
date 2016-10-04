'use strict';

import express from 'express';
import config from '../../config/environment';
import createCrudController from './generated.controller.crud';
import _ from 'lodash';

module.exports = function(modelController, formlyController) {
  //TODO user the Router as passed in via options
  return createModelRoute(modelController, formlyController, express.Router());
};

/**
 * @param router
 * @returns {Function}
 */
function createModelRoute(modelController, formlyController, router) {

  let crudController = createCrudController(modelController);

  router.get(`/${config.modelFormlyRoute}`, gettifyPromise(formlyController.createModelFormlyFields));
  router.get(`/${config.modelColumnRoute}`, gettifyPromise(formlyController.createModelColumns));

  router.get('/', crudController.index);
  router.get('/:id/history', crudController.history);
  router.get('/:id', crudController.show);
  router.post('/', crudController.create);
  router.put('/:id', crudController.create);
  router.patch('/:id', crudController.create);
  router.delete('/:id', crudController.destroy);

  return router;
}

/**
 * @param fn
 * @returns {Function}
 */
function gettifyPromise(fn) {
  return function(req, res) {
    return fn().then((payload) => {
      return res.status(200).json(payload);
    })
    .catch((err) => {
      console.error('Error gettifying promise', err);
      return res.status(500);
    });
  }
}
