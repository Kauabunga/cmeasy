'use strict';

import _ from 'lodash';
import uuid from 'uuid';
import Promise from 'bluebird';


/**
 *
 */
export default function(cmeasy, mongoose, model){
  var mongooseModel = mongoose.model(getMongoModelName(cmeasy.getNamespace(), model), new mongoose.Schema({ }, getOptions()));

  //Remove any dud models from the db
  cleanModel(cmeasy, mongooseModel);

  return mongooseModel;
}

/**
 *
 */
function cleanModel(cmeasy, model){
  return model.find({}).execAsync()
    .then(removeModelsWithoutProperty(cmeasy.getIdKey()))
    .then(removeModelsWithoutProperty(cmeasy.getInstanceKey()));
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

/**
 *
 */
function removeModelsWithoutProperty(property){
  return function(items){
    return _(items).map(function(item){
      if( ! item[property] || item[property] === ''){
        item.removeAsync();
        return undefined;
      }
      else {
        return item;
      }
    }).filter().value;
  }
}
