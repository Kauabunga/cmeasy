

'use strict';


import _ from 'lodash';
import flat from 'flat';

/**
 *
 */
export default flatten;


/**
 *
 * @param schema
 * @returns {*}
 */
function flatten(schema){

  return _(flat(schema, { maxDepth: 0 }))
    .map(parseFlattenPaths)
    .filter()
    .map(getDefinitionsFromPaths(schema))
    .filter()
    .reduce(_.merge);
}

/**
 *
 */
function getDefinitionsFromPaths(schema){
  return function(path){

    var definition = _.merge({path: path}, _.get(schema, path));

    if(definition.type instanceof Array){
      return {[path]: _.merge(definition, {type: flatten(definition.type[0] || {})})};
    }
    else {
      return {[path]: definition};
    }

  }
}

/**
 *
 * @param key
 */
function parseFlattenPaths(path, key){

  if(key.indexOf('type')){
    return key.substring(0, key.indexOf('type') - 1);
  }
  else {
    return undefined;
  }

}
