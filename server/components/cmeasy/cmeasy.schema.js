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
  return mongoose.model(getMongoSchemaName(namespace, cmeasy), new mongoose.Schema({ meta: getMetaType(cmeasy), definition: {} }, getOptions()));
}

/**
 *
 */
function getMetaType(cmeasy){
  return {
    dateCreated: {
      $type: Number,
      default: Date.now
    },
    author: {
      $type: String,
      default: 'Server default'
    },
    comment: {
      $type: String,
      default: 'Server seed'
    },
    [cmeasy.getIdKey()]: {
      $type: String,
      required: true
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

  //TODO move to cmeasy?
  console.log('Creating meta schema');

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

      //TODO formly controller needs to handle nested objects
      //    e.g. meta._cmeasyId
      meta: {
        [cmeasy.getIdKey()]: {
          type: 'String',
          displayColumn: true,
          disableEdit: true,

          editOnCreate: true //TODO needs to be a only edit on create type
        },
        dateCreated: {
          type: 'Date',
          disableEdit: true
        },
        author: {
          type: 'String',
          disableEdit: true
        },
        comment: {
          type: 'String',
          disableEdit: true
        }
      },

      definition: {
        type: 'String',
        __schemaType__: true
      }

    }
  }
}
