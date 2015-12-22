/**
 * Cmeasy
 */

'use strict';

import _ from 'lodash';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import express from 'express';

import createModelMongo from './components/cmeasy/cmeasy.model';
import createModelDao from './components/cmeasy/cmeasy.controller.dao';
import createModelFormly from './components/cmeasy/cmeasy.controller.formly';


/**
 *
 */
export default class Cmeasy {

  constructor(options){
    this.options = options;
    this.models = this.generateModels(options.models);
  }

  generateModels(models){
    return _(models)
      .map((model) => {
        return new CmeasyModel('CMEASYNAMESPACE', this.getMongoose(), model);
      }).value();
  }

  getMongoose(){
    return this.options.mongoose || mongoose;
  }

  getExpress(){
    return this.options.express || express;
  }

  getModels(){
    return this.models;
  }

  getRootRoute(){
    return this.options.rootRoute;
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
    this.disableCreate = model.disableCreate === true

    this._cmeasyId = _.camelCase(model.name);
    this._mongoModel = createModelMongo(namespace, mongoose, this);
    this._dao = createModelDao(this);
    this._formly = createModelFormly(this);
  }

  getMongoModel(){
    return this._mongoModel;
  }

  getFormly(){
    return this._formly;
  }

  getDao(){
    return this._dao;
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
