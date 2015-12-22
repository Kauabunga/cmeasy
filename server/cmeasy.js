/**
 * Cmeasy
 */

'use strict';

import _ from 'lodash';

import Promise from 'bluebird';
var mongoose = Promise.promisifyAll(require('mongoose'));
mongoose.Promise = Promise;

import express from 'express';

import createModel from './components/cmeasy/cmeasy.model';
import createSchema from './components/cmeasy/cmeasy.schema';

import createDaoController from './components/cmeasy/cmeasy.controller.dao';
import createSchemaController from './components/cmeasy/cmeasy.controller.schema';
import createFormlyController from './components/cmeasy/cmeasy.controller.formly';
import createCrudController from './api/generated/index';

/**
 *
 */
export default class Cmeasy {

  constructor(options){
    this.name = options.name || 'Cmeasy';
    this.options = options;
    this.models = [];
    this.generateModels(options.models);

    //TODO need metameta model that defines list of schemas added - may not be apart of the passed models
    //TODO Or.... Store complete Cmeasy model in database
  }

  generateModels(models){
    return _(models).map(this.addModel.bind(this)).value();
  }

  addModel(model){
    var newModel = new CmeasyModel(this.getNamespace(), this.getMongoose(), model);
    this.models.push(newModel);
    return newModel;
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


}

/**
 *
 */
class CmeasyModel {

  constructor(namespace, mongoose, model){
    this.name = model.name;
    this.definition = model.definition;
    this.singleton = model.singleton;
    this.disableCreate = model.disableCreate === true;

    this._cmeasyId = _.camelCase(model.name);
    this._model = createModel(namespace, mongoose, this);
    this._schema = createSchema(namespace, mongoose, this);

    this._dao = createDaoController(this);
    this._schemaController = createSchemaController(this);
    this._formly = createFormlyController(this);
    this._crud = createCrudController(this);

  }


  getModel(){
    return this._model;
  }

  getSchema(){
    return this._schema;
  }

  getSchemaController(){
    return this._schemaController;
  }

  getFormly(){
    return this._formly;
  }

  getDao(){
    return this._dao;
  }

  getCrud(){
    return this._crud;
  }

  getId(){
    return this[this.getIdKey()];
  }

  getIdKey(){
    return '_cmeasyId';
  }

  isSingleton(){
    return this.singleton;
  }

  getDefinition(){
    return this.definition;
  }

}
