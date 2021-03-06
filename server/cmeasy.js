'use strict';

import _ from 'lodash';
import R from 'ramda';
import Promise from 'bluebird';
const mongoose = require('mongoose');
mongoose.Promise = Promise;

import express from 'express';

import config from './config/index';

import createModel from './components/cmeasy/cmeasy.model';
import createSchema from './components/cmeasy/cmeasy.schema';
import {createInstance} from './components/cmeasy/cmeasy.functions.models';

import createModelController from './components/cmeasy/cmeasy.controller.model';
import createSchemaController from './components/cmeasy/cmeasy.controller.schema';
import createFormlyController from './components/cmeasy/cmeasy.controller.formly';
import createCrudController from './api/generated/index';

const debug = require('debug')('cmeasy:cmeasy');

import User from '../server/api/user/user.model';

const CMEASY_ID = '_cmeasyId';
const CMEASY_INSTANCE_ID = '_cmeasyInstanceId';

export default class Cmeasy {

  constructor(options = {}) {
  }

  static create(options) {
    const instance = new Cmeasy(options);
    debug('Initialising');
    instance.name = options.name || 'Cmeasy';
    instance.options = new CmeasyOptions(options);
    instance.models = [];

    instance._schema = createSchema(instance.getNamespace(), instance.getMongoose(), instance);
    instance._schemaController = createSchemaController(instance);
    instance._schemaFormly = createFormlyController(instance.getSchemaMetaId(), instance.getSchemaController());
    instance._schemaCrud = createCrudController(instance.getSchemaController(), instance.getSchemaFormly());

    debug('Generating models');
    return Promise.all(instance.generateModels(options.models))
      .then(() => {
        return instance.seedDatabase();
      })
      .then(() => {
        debug('Initialisation complete');
        return instance;
      });
  }

  generateModels(models) {
    return _(models)
      .map(this.initModel.bind(this))
      .value();
  }

  initModel(model) {
    return this.getSchemaController()
      .create(this.getModelSchema(model))
      .then(this.getAsObject.bind(this))
      .then(this.createModel.bind(this))
      .catch(function (error) {
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

    // Add a default order to the items
    _(definition)
      .map(function (definitionItem) {
        definitionItem.order = definitionItem.order || (++index) * 10;
      })
      .value();

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
      })
      .first();
  }

  getNamespace() {
    return this.name;
  }

  getMongoose() {
    return this.getOptions()
      .getMongoose();
  }

  getExpress() {
    return this.getOptions()
      .getExpress();
  }

  getRootRoute() {
    return this.getOptions()
      .getRootRoute();
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

  seedDatabase() {
    const debug = require('debug')('cmeasy:cmeasy:seedDatabase');
    const localOptions = this.getOptions().options;
    debug('Seeding database');
    if (!localOptions.initialUsers) {
      debug('options.initialUsers is null or undefined, using defaults');
      localOptions.initialUsers = {
        clean: true,
        data: [
          {
            name: 'Test User',
            email: 'test@test.com',
            password: 'test'
          },
          {
            name: 'Admin',
            role: 'admin',
            email: 'admin@admin.com',
            password: 'admin'
          }
        ]
      }
    }

    let seedActions = Promise.resolve();
    if (localOptions.initialUsers.clean) {
      debug('Erasing all users from db');
      seedActions = User.find({})
        .remove();
    }

    seedActions = seedActions
      .then(() => User.create(localOptions.initialUsers.data))
      .catch((error) => {
        debug('Seed database failed');
        console.error(error);
        process.exit(1);
      });

    if (!R.isNil(localOptions.models)) {
      debug('Checking for model initialData');

      const modelsToSeed = R.filter((model) => {
        return model.initialData;
      })(localOptions.models);

      if (!R.isNil(modelsToSeed)) {
        debug(`Models with initialData: ${modelsToSeed.length}`);
        seedActions = seedActions.then(() => this.createInitialModelData(modelsToSeed));
      }
    }

    return seedActions;
  }

  createInitialModelData(modelsToSeed) {
    return Promise.all(modelsToSeed.map((modelDefinition) => {
      const cmeasyModelName = modelDefinition.definition._cmeasyId.default;
      const modelDefinitionData = modelDefinition.initialData.data;

      debug(`Enforcing initialData for: ${cmeasyModelName}`);

      let modelActions = Promise.resolve();
      const cmeasyModel = this.getModel(cmeasyModelName);
      const mongooseModel = cmeasyModel.getModel();

      // Erase all current model data
      if (modelDefinition.initialData.clean) {
        debug(`${cmeasyModelName} has "clean" set, clearing all current model data`);
        modelActions = modelActions.then(() => cmeasyModel.getModel()
          .find({})
          .remove());
      }

      // Check for instances with matching properties & do not update them if present
      debug(`${cmeasyModelName} checking for instances with properties matching "initialData.data"`);
      modelActions = modelActions.then(() => {
        return mongooseModel.find({
          $or: modelDefinition.initialData.data
        });
      })
        .then((modelInstances) => {
          debug(`${cmeasyModelName} found ${modelInstances.length} matching instances against definition data`);

          return Promise.all(R.map((modelDefinitionDataItem) => {
            debug(`${cmeasyModelName} checking for presence of ${JSON.stringify(modelDefinitionDataItem)}`);

            // Determine whether one of the returned instances matches the modelDefinition
            const matchingInstance = R.find((modelInstance) => {
              const propertyComparison = R.map((modelDefinitionPair) => {
                return R.propEq.apply(R, modelDefinitionPair);
              })(R.toPairs(modelDefinitionDataItem));
              return R.allPass(propertyComparison)(modelInstance);
            })(modelInstances);

            if (!matchingInstance) {
              debug(`${cmeasyModelName} no instance found, creating`);
              return createInstance(this, cmeasyModel, modelDefinitionDataItem);
            } else {
              debug(`${cmeasyModelName} instance found, ignoring`);
              return Promise.resolve();
            }
          })(modelDefinitionData));

        });

      return modelActions;
    }));
  }

}

class CmeasyOptions {

  constructor(options) {
    this.options = options;

    if (!this.isUserDefinedMongoose()) {
      this.connectToMongo();
    }

    if (!this.isUserDefinedEnvironment()) {
      this.options.environment = 'production';
    }
  }

  connectToMongo() {
    if (!mongoose.connection.readyState) {
      mongoose.connect(config.mongo.uri, config.mongo.options);
      mongoose.connection.on('error', function (err) {
        console.error('MongoDB connection error: ' + err);
        process.exit(-1);
      });
    }
  }

  getMongoose() {
    return this.options.mongoose || mongoose;
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

  getUserModel() {
    return User;
  }
}

class CmeasyModel {

  constructor(
    cmeasy,
    model
  ) {
    this.meta = model.meta;
    this.definition = model.definition;

    this.cmeasy = cmeasy;

    this._model = createModel(cmeasy, cmeasy.getMongoose(), this);
    this._modelController = createModelController(this, cmeasy);
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
