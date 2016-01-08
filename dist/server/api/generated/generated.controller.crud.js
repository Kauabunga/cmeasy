/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/generated              ->  index
 * POST    /api/generated              ->  create
 * GET     /api/generated/:id          ->  show
 * PUT     /api/generated/:id          ->  update
 * DELETE  /api/generated/:id          ->  destroy
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

/**
 *
 */

exports['default'] = function (modelController) {

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
    return modelController.index().then(responseWithResult(res))['catch'](handleError(res));
  }

  /**
   * Gets a single Generated from the DB
   *
   */
  function show(req, res) {
    return modelController.show(req.params.id).then(handleEntityNotFound(res)).then(responseWithResult(res))['catch'](handleError(res));
  }

  /**
   * Creates a new Generated in the DB
   *
   */
  function create(req, res) {
    return modelController.create(req.body).then(responseWithResult(res, 201))['catch'](handleError(res));
  }

  /**
   * Gets the history of an item
   *
   */
  function history(req, res) {
    return modelController.history(req.params.id).then(handleEntityNotFound(res)).then(responseWithResult(res))['catch'](handleError(res));
  }

  /**
   * Deletes a Generated from the DB
   *
   * TODO implement
   */
  function destroy(req, res) {
    return modelController.destroy(req.params.id).then(handleEntityNotFound(res)).then(responseWithResult(res))['catch'](handleError(res));
  }
};

/**
 *
 */
function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    console.error('Controller Error', err);
    return res.status(statusCode).send(err);
  };
}

/**
 *
 * @param res
 * @param statusCode
 * @returns {Function}
 */
function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    } else {
      return entity;
    }
  };
}

/**
 *
 * @param res
 * @returns {Function}
 */
function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}
module.exports = exports['default'];
//# sourceMappingURL=generated.controller.crud.js.map
