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

  constructor(options){
    this.name = options.name || 'Cmeasy';
    this.options = options;

    this.connectToMongo();

    this._schema = createSchema(this.getNamespace(), this.getMongoose(), this);
    this._schemaController = createSchemaController(this);
    this._schemaFormly = createFormlyController(this.getSchemaMetaId(), this.getSchemaController()); //could be a singleton object rather than having one for each model
    this._schemaCrud = createCrudController(this.getSchemaController(), this.getSchemaFormly()); //could be a singleton object rather than having one for each model


    return Promise.all(this.generateModels(options.models))
      .then((models) => {

        console.log('created models', models);

        this.models = models;
        return(this);
      });
  }

  generateModels(models){
    console.log('moooo');
    return _(models).map(this.createModel.bind(this)).value();
  }

  createModel(model){
    console.log('moooo2222', _.merge(model.definition, {['_cmeasyId']: _.camelCase(model.name)}));
    return this.getSchemaController().create(_.merge(model.definition, {['_cmeasyId']: _.camelCase(model.name)}))
      .then((modelSchema) => {
          console.log('moooo3333', modelSchema);
          return new CmeasyModel(this, model);
      })
      .catch(function(error){
        console.error('error', error);
      });

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
    return _(this.models).filter((model)=>{return model.getId() === id;}).first();
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
 *
 */
class CmeasyModel {

  constructor(cmeasy, model){

    this.name = model.name;
    this.definition = model.definition;
    this.singleton = model.singleton;
    this.disableCreate = model.disableCreate === true;

    this._cmeasyId = _.camelCase(model.name);

    this._model = createModel(cmeasy.getNamespace(), cmeasy.getMongoose(), this);
    this._modelController = createModelController(this, cmeasy.getSchemaController());
    this._modelFormly = createFormlyController(this.getId(), cmeasy.getSchemaController());
    this._modelCrud = createCrudController(this.getModelController(), this.getModelFormly());

    //this._schema = createSchema(namespace, mongoose, this);
    //this._schemaController = createSchemaController(this);
    //this._schemaFormly = createFormlyController(this.getMetaSchemaId(), this.getSchemaController()); //could be a singleton object rather than having one for each model
    //this._schemaCrud = createCrudController(this.getSchemaController(), this.getSchemaFormly()); //could be a singleton object rather than having one for each model

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
    return this._cmeasyId;
  }

  getIdKey(){
    return CMEASY_ID;
  }

  getInstanceKey(){
    return CMEASY_INSTANCE_ID;
  }

  isSingleton(){
    return this.singleton;
  }

  getDefinition(){
    return this.definition;
  }

}
