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
  return mongoose.model(getMongoSchemaName(namespace, cmeasy), new mongoose.Schema({ meta: {}, definition: {} }, { strict: false }));
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

      fields: {
        type: [{}]

      }

    }
  }
}
