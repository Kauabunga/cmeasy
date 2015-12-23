'use strict';

import _ from 'lodash';
import uuid from 'uuid';


/**
 *
 */
export default function(namespace, mongoose, model){
  return mongoose.model(getMongoSchemaName(namespace, model), new mongoose.Schema({ meta: {}, definition: {} }, { strict: true }));
}

/**
 *
 */
function getMongoSchemaName(namespace, model){
  return `${getSafeName(namespace)}_Schema_${model.getId()}`;
}

/**
 *
 * @param name
 */
function getSafeName(name){
  return _.camelCase((name || '').toString().replace(/\s/g, ''));
}
