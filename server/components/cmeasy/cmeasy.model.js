'use strict';

import _ from 'lodash';
import uuid from 'uuid';
import Promise from 'bluebird';


/**
 *
 */
export default function(namespace, mongoose, model){
  return mongoose.model(getMongoModelName(namespace, model), new mongoose.Schema({ }, getOptions()));
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
 *
 */
function getMongoModelName(namespace, model){
  return `${getSafeName(namespace)}_Model_${model.getId()}`;
}

/**
 *
 * @param name
 */
function getSafeName(name){
  return _.camelCase((name || '').toString().replace(/\s/g, ''));
}

