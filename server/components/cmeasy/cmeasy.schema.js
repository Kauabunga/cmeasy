'use strict';

import _ from 'lodash';
import uuid from 'uuid';
import Promise from 'bluebird';


/**
 *
 */
export default function(namespace, mongoose, cmeasy){
  var schemaModel = createMongooseModel(namespace, mongoose, cmeasy);

  addMetaSchema(schemaModel, cmeasy);

  return schemaModel;
}

/**
 *
 */
function createMongooseModel(namespace, mongoose, cmeasy){
  return mongoose.model(getMongoSchemaName(namespace, cmeasy), new mongoose.Schema(getSchemaType(cmeasy), getOptions()));
}

/**
 *
 */
function getSchemaType(cmeasy){
  return {
    meta: getMetaType(cmeasy),
    definition: {}
  };
}

/**
 *
 * Defines both the mongoose Schema.meta types and the MetaSchema.definition.meta instance
 *
 * TODO reuse this for defaulting a new Schema.meta values
 *
 */
function getMetaType(cmeasy){

  return {

    [cmeasy.getIdKey()]: {
      $type: String,
      displayColumn: true,
      disableEdit: false, //Note this is a special case where when creating we do allow it to be edited
      label: 'Schema Id',
      required: true
    },
    dateCreated: {
      $type: Number,
      default: Date.now,
      disableEdit: true
    },
    author: {
      $type: String,
      default: 'Server default',
      disableEdit: true
    },
    comment: {
      $type: String,
      default: 'Server seed',
      disableEdit: false,
      disableDisplay: true
    },


    singleton: {
      $type: Boolean,
      default: false,
      disableEdit: false
    },
    disableDelete: {
      $type: Boolean,
      default: false,
      disableEdit: false
    },
    disableCreate: {
      $type: Boolean,
      default: false,
      disableEdit: false
    }
  }
}

/**
 *
 */
function getOptions(){
  return {
    strict: false,
    typeKey: '$type'
  };
}

/**
 * Meta Schema defining schema structure/definition
 */
function addMetaSchema(schemaModel, cmeasy){
  schemaModel.createAsync(getMetaSchema(cmeasy));
  return schemaModel;
}

/**
 *
 */
function getMongoSchemaName(namespace, cmeasy){
  return `${getSafeName(namespace)}_Schema_${cmeasy.getSchemaMetaId()}`;
}

/**
 *
 * @param name
 */
function getSafeName(name){
  return _.camelCase((name || '').toString().replace(/\s/g, ''));
}

/**
 * Replace all $type references with type
 */
function getMetaSchemaType(cmeasy){
  return _(getMetaType(cmeasy))
    .map(function(item, key){
      return {[key]: _.merge(_.omit(item, '$type'), {type: getPrototypeName(item.$type)})};
    })
    .reduce(_.merge);
}

/**
 *
 * @param prototype
 * @returns {*}
 */
function getPrototypeName(prototype){
  if (typeof prototype.name !== 'undefined') {
    return prototype.name;
  }
  else {
    return /function (.+)\(/.exec(prototype.toString())[1];
  }
}

/**
 *
 * @param model
 */
function getMetaSchema(cmeasy){
  return {

    meta: {
      dateCreated: Date.now(),
      author: 'Server',
      comment: 'Initial seed',
      [cmeasy.getIdKey()]: cmeasy.getSchemaMetaId()
    },

    definition: {
      meta: getMetaSchemaType(cmeasy),
      definition: {
        type: '__schemaType__'
      }
    }
  }
}
