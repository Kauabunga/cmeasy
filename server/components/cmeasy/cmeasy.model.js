'use strict';

import _ from 'lodash';
import uuid from 'uuid';

/**
 *
 */
export default function(namespace, mongoose, model){
  return mongoose.model(getMongoModelName(namespace, model), new mongoose.Schema(getMongoSchema(model)));
}

/**
 *
 * @param model
 * @returns {*}
 */
function getMongoSchema(model){
  return _.merge(model.getDefinition(), getBaseSchema(model))
}

/**
 *
 */
function getMongoModelName(namespace, model){
  return `${getSafeName(namespace)}_${model.getId()}`;
}

/**
 *
 * @param name
 */
function getSafeName(name){
  return _.camelCase((name || '').toString().replace(/\s/g, ''));
}

/**
 *
 */
function getBaseSchema(model){
  return {

    dateCreated: {
      type: Date,
      default: new Date(),
      disableEdit: true,
      unique: false
    },

    //TODO create public content types that can be submitted to
    author: {
      type: String,
      default: 'Server',
      disableEdit: true,
      unique: false
    },

    [model.getIdKey()]: {
      type: String,
      default: getDefaultId(model),
      disableEdit: true,
      unique: false
    }
  }
}

/**
 *
 */
function getDefaultId(model){
  return function(){
    if(model.isSingleton()){
      return model.getId();
    }
    else {
      return uuid.v4();
    }
  }
}

