'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _generatedControllerCrud = require('./generated.controller.crud');

var _generatedControllerCrud2 = _interopRequireDefault(_generatedControllerCrud);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

module.exports = function (modelController, formlyController) {
  //TODO user the Router as passed in via options
  return createModelRoute(modelController, formlyController, _express2['default'].Router());
};

/**
 * @param router
 * @returns {Function}
 */
function createModelRoute(modelController, formlyController, router) {

  var crudController = (0, _generatedControllerCrud2['default'])(modelController);

  router.get('/' + _config2['default'].modelFormlyRoute, gettifyPromise(formlyController.createModelFormlyFields));
  router.get('/' + _config2['default'].modelColumnRoute, gettifyPromise(formlyController.createModelColumns));

  router.get('/', crudController.index);
  router.get('/:id/history', crudController.history);
  router.get('/:id', crudController.show);
  router.post('/', crudController.create);
  router.put('/:id', crudController.create);
  router.patch('/:id', crudController.create);
  router['delete']('/:id', crudController.destroy);

  return router;
}

/**
 * @param fn
 * @returns {Function}
 */
function gettifyPromise(fn) {
  return function (req, res) {
    return fn().then(function (payload) {
      return res.status(200).json(payload);
    })['catch'](function (err) {
      console.error('Error gettifying promise', err);
      return res.status(500);
    });
  };
}
//# sourceMappingURL=index.js.map
