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

  constructor(options = {}){
    this.name = options.name || 'Cmeasy';
    this.options = options;
    this.models = [];

    this.connectToMongo();

    this._schema = createSchema(this.getNamespace(), this.getMongoose(), this);
    this._schemaController = createSchemaController(this);
    this._schemaFormly = createFormlyController(this.getSchemaMetaId(), this.getSchemaController());
    this._schemaCrud = createCrudController(this.getSchemaController(), this.getSchemaFormly());

    return Promise.all(this.generateModels(options.models))
      .then((models) => {
        return(this);
      });
  }

  generateModels(models){
    return _(models).map(this.initModel.bind(this)).value();
  }

  initModel(model){
    return this.getSchemaController()
      .create(this.getModelSchema(model))
      .then(this.getAsObject.bind(this))
      .then(this.createModel.bind(this))
      .catch(function(error){
        console.error('error', error);
      });
  }

  createModel(model){
    var existingModel = this.getModel(model.meta._cmeasyId);
    if(existingModel){
      return existingModel
    }
    else {
      var newModel = new CmeasyModel(this, model);
      this.models.push(newModel);
      return newModel;
    }
  }

  getAsObject(obj){
    return obj.toObject()
  }

  getModelSchema(model){
    return {
      meta: {
        [this.getIdKey()]: _.camelCase(model.name),
        author: 'Cmeasy User',
        comment: 'Cmeasy init',
        singleton: model.singleton || false,
        disableDelete: model.disableDelete || false,
        disableCreate: model.disableCreate || false
      },
      definition: model.definition || {}
    };
  }


  //TODO config urls
  connectToMongo(){

    var mongoose = this.getMongoose();
    mongoose.connect(config.mongo.uri, config.mongo.options);
    mongoose.connection.on('error', function(err) {
      console.error('MongoDB connection error: ' + err);
      process.exit(-1);
    });

    // Populate databases with sample data
    if (config.seedDB) { require('./config/seed')(); }

    return mongoose;
  }


  getNamespace(){
    return this.name;
  }

  getMongoose(){
    return (this.options.mongoose && Promise.promisifyAll(this.options.mongoose)) || mongoose;
  }

  getExpress(){
    return this.options.express || express;
  }

  getModels(){
    return this.models;
  }

  getModel(id){
    return _(this.models)
      .filter((model) => { return model.getId() === id; }).first();
  }

  getRootRoute(){
    return this.options.rootRoute;
  }

  getApiRoute(){
    return `${this.getRootRoute()}/api`;
  }

  getSchema(){
    return this._schema;
  }

  getSchemaController(){
    return this._schemaController;
  }

  getSchemaMetaId(){
    return 'CmeasyMetaSchema';
  }
  getSchemaCrud(){
    return this._schemaCrud;
  }

  getSchemaFormly(){
    return this._schemaFormly;
  }

  getIdKey(){
    return CMEASY_ID;
  }

  getInstanceKey(){
    return CMEASY_INSTANCE_ID;
  }

}


/**
 * TODO
 */
class CmeasyOptions {

}


/**
 *
 */
class CmeasyModel {

  constructor(cmeasy, model){

    this.meta = model.meta;
    this.definition = model.definition;

    this.cmeasy = cmeasy;

    this._model = createModel(cmeasy, cmeasy.getMongoose(), this);
    this._modelController = createModelController(this, cmeasy.getSchemaController());
    this._modelFormly = createFormlyController(this.getId(), cmeasy.getSchemaController());
    this._modelCrud = createCrudController(this.getModelController(), this.getModelFormly());

  }

  getModel(){
    return this._model;
  }

  getModelFormly(){
    return this._modelFormly;
  }

  getModelController(){
    return this._modelController;
  }

  getModelCrud(){
    return this._modelCrud;
  }

  getId(){
    return this.meta._cmeasyId;
  }

  getIdKey(){
    return CMEASY_ID;
  }

  getInstanceKey(){
    return CMEASY_INSTANCE_ID;
  }

  isSingleton(){
    return this.meta.singleton;
  }

  getDefinition(){
    return this.definition;
  }

}
