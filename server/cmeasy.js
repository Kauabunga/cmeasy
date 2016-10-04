/**
 * Cmeasy
 */

'use strict';

import _ from 'lodash';

import Promise from 'bluebird';
var mongoose = Promise.promisifyAll(require('mongoose'));
mongoose.Promise = Promise;

import express from 'express';

import config from './config/environment/index';

import createModel from './components/cmeasy/cmeasy.model';
import createSchema from './components/cmeasy/cmeasy.schema';

import createModelController from './components/cmeasy/cmeasy.controller.model';
import createSchemaController from './components/cmeasy/cmeasy.controller.schema';
import createFormlyController from './components/cmeasy/cmeasy.controller.formly';
import createCrudController from './api/generated/index';

const CMEASY_ID = '_cmeasyId';
const CMEASY_INSTANCE_ID = '_cmeasyInstanceId';

/**
 *
 */
export default class Cmeasy {

  constructor(options = {}) {
    this.name = options.name || 'Cmeasy';
    this.options = new CmeasyOptions(options);
    this.models = [];

    this._schema = createSchema(this.getNamespace(), this.getMongoose(), this);
    this._schemaController = createSchemaController(this);
    this._schemaFormly = createFormlyController(this.getSchemaMetaId(), this.getSchemaController());
    this._schemaCrud = createCrudController(this.getSchemaController(), this.getSchemaFormly());

    return Promise.all(this.generateModels(options.models))
      .then((models) => {
        return (this);
      });
  }

  generateModels(models) {
    return _(models).map(this.initModel.bind(this)).value();
  }

  initModel(model) {
    return this.getSchemaController()
      .create(this.getModelSchema(model))
      .then(this.getAsObject.bind(this))
      .then(this.createModel.bind(this))
      .catch(function(error) {
        console.error('error', error);
      });
  }

  createModel(model) {
    var existingModel = this.getModel(model.meta._cmeasyId);

    if (existingModel) {
      return existingModel
    }
    else {
      var newModel = new CmeasyModel(this, model);
      this.models.push(newModel);
      return newModel;
    }
  }

  getAsObject(obj) {
    return obj.toObject()
  }

  getModelSchema(model) {
    return {
      meta: {
        [this.getIdKey()]: _.camelCase(model.name),
        author: 'Cmeasy User',
        comment: 'Cmeasy init',
        singleton: model.singleton || false,
        disableDelete: model.disableDelete || false,
        disableCreate: model.disableCreate || false
      },
      definition: this.getDefaultDefinition(model.definition || {})
    };
  }

  getDefaultDefinition(definition) {
    var index = 0;

    //Add a default order to the items
    _(definition).map(function(definitionItem) {
      definitionItem.order = definitionItem.order || (++index) * 10;
    }).value();

    return definition;
  }

  getOptions() {
    return this.options;
  }

  getModels() {
    return this.models;
  }

  getModel(id) {
    return _(this.models)
      .filter((model) => {
        return model.getId() === id;
      }).first();
  }

  getNamespace() {
    return this.name;
  }

  getMongoose() {
    return this.getOptions().getMongoose();
  }

  getExpress() {
    return this.getOptions().getExpress();
  }

  getRootRoute() {
    return this.getOptions().getRootRoute();
  }

  getApiRoute() {
    return `${this.getRootRoute()}/api`;
  }

  getSchema() {
    return this._schema;
  }

  getSchemaController() {
    return this._schemaController;
  }

  getSchemaMetaId() {
    return 'CmeasyMetaSchema';
  }

  getSchemaCrud() {
    return this._schemaCrud;
  }

  getSchemaFormly() {
    return this._schemaFormly;
  }

  getIdKey() {
    return CMEASY_ID;
  }

  getInstanceKey() {
    return CMEASY_INSTANCE_ID;
  }

}


/**
 * TODO
 */
class CmeasyOptions {

  constructor(options) {

    this.options = options;

    if (!this.isUserDefinedMongoose()) {
      this.connectToMongo();
    }
    if (!this.isUserDefinedEnvironment()) {
      this.options.environment = 'production';
    }

    this.seedMongo();

  }

  //TODO config urls
  connectToMongo() {
    if (!mongoose.connection.readyState) {
      mongoose.connect(config.mongo.uri, config.mongo.options);
      mongoose.connection.on('error', function(err) {
        console.error('MongoDB connection error: ' + err);
        process.exit(-1);
      });
    }
  }

  // TODO always seed - i.e. fix tests to handle initial seed
  seedMongo() {
    if (config.seedDB) {
      require('./config/seed')();
    }
  }

  getMongoose() {
    return (this.options.mongoose && Promise.promisifyAll(this.options.mongoose)) || Promise.promisifyAll(mongoose);
  }

  isUserDefinedEnvironment() {
    return !!this.options.environment;
  }

  isUserDefinedMongoose() {
    return !!this.options.mongoose;
  }

  isUserDefinedExpressApp() {
    return !!this.options.express;
  }

  getExpress() {
    return this.options.express || express;
  }

  getRootRoute() {
    return this.options.rootRoute || 'admin';
  }

}


/**
 *
 */
class CmeasyModel {

  constructor(cmeasy, model) {

    this.meta = model.meta;
    this.definition = model.definition;

    this.cmeasy = cmeasy;

    this._model = createModel(cmeasy, cmeasy.getMongoose(), this);
    this._modelController = createModelController(this, cmeasy.getSchemaController());
    this._modelFormly = createFormlyController(this.getId(), cmeasy.getSchemaController());
    this._modelCrud = createCrudController(this.getModelController(), this.getModelFormly());

  }

  getModel() {
    return this._model;
  }


  getModelFormly() {
    return this._modelFormly;
  }

  getModelController() {
    return this._modelController;
  }

  getModelCrud() {
    return this._modelCrud;
  }

  getId() {
    return this.meta._cmeasyId;
  }

  getIdKey() {
    return CMEASY_ID;
  }

  getInstanceKey() {
    return CMEASY_INSTANCE_ID;
  }

}
