
'use strict';

import _ from 'lodash';
import {Promise} from 'bluebird';
import flatten from './cmeasy.flatten.service';

/**
 *
 */
export default function(id, schemaController){

  return {
    createModelFormlyFields: createModelFormlyFields(id, schemaController),
    createModelColumns: createModelColumns(id, schemaController)
  };

}

/**
 *
 * @param model
 */
function createModelColumns(id, schemaController){
  return function(){
    return schemaController.show(id)
      .then(getSchemaDefinition)
      .then(flatten)
      .then(function(modelSchema){
        return _(modelSchema)
          .map(shouldDisplayColumn)
          .filter()
          .value();
      });
  };
}

/**
 *
 * @param model
 */
function createModelFormlyFields(id, schemaController){
  return function(){
    return schemaController.show(id)
      .then(getSchemaDefinition)
      .then(flatten)
      .then(function(modelSchema){
        return _(modelSchema)
          .sortBy('order')
          .map(getPathField)
          .filter()
          .value();
      });
  }
}


/**
 *
 * @param type
 */
function getPathField(path, key){

  if( excludedProperties(path) ){
    return undefined;
  }
  else {
    console.log('getPathField', path, path.type.toString().toLowerCase());
    return _.merge(getDefaultField(path), getFieldTypeMap()[path.type.toString().toLowerCase()](path, key));
  }

}
/**
 *
 */
function getFieldTypeMap(){
  return {

    array: function(path){
      //TODO

      //if(path.options.autocomplete){
      //  field.templateOptions.autocompleteLabel = path.options.autocompleteLabel;
      //  field.templateOptions.autocompleteType = path.options.autocompleteType;
      //  field.templateOptions.autocompleteId = path.options.autocompleteId;
      //  field.templateOptions.autocompleteChip = path.options.autocompleteChip;
      //  field.type = 'mdChipsAutocomplete';
      //}
      //else if (path.options.displayLink){
      //  field.templateOptions.linkType = path.options.linkType;
      //  field.templateOptions.linkId = path.options.linkId;
      //  field.type = 'adminLink';
      //}
      //else {
      //  //Assume only a single depth
      //  field.templateOptions.fields = [];
      //  _.map(path.schema.paths, function(path){
      //    var pathField = getPathField(path);
      //    if(pathField){ field.templateOptions.fields.push(pathField); }
      //  });
      //  field.type = 'adminRepeat';
      //}
    },

    select: function(path){
      return {
        type: 'mdSelect',
        templateOptions: {selectOptions: path.enum }
      };
    },

    string: function(path){
      return { type: 'mdInput'};
    },

    html: function(path){
      return { type: 'WYSIWYG'};
    },

    number: function(path){
      //TODO
      return { type: 'mdInput'};
    },

    boolean: function(path){
      return { type: 'mdCheckbox'};
    },

    __schematype__: function(path){
      return { type: 'cmeasyMetaRepeat' };
    }
  };
}


/**
 *
 * @param path
 */
function getDefaultField(path){
  return {
    key: path.path,
    templateOptions: {
      label: path.label || convertPathToLabel(path.path),
      cssClass: path.cssClass || ''
    }
  };
}



/**
 *
 * @param model
 */
function getSchemaDefinition(schema){
  return schema.definition;
}


/**
 *
 * @param text
 */
function convertPathToLabel(text){
  return _(text.split('.')).map(function(splitText){
    return unCamelCase(splitText);
  }).value().join(' -> ');
}

/**
 *
 */
function unCamelCase(text){
  // insert a space before all caps
  return text.replace(/([A-Z])/g, ' $1')
    // uppercase the first character
    .replace(/^./, function(str){ return str.toUpperCase(); });
}

/**
 *
 * @param path
 * @param key
 * @returns {*}
 */
function shouldDisplayColumn(path, key){
  return path && path.displayColumn ? key : undefined;
}

/**
 *
 * @param path
 * @returns {boolean}
 */
function excludedProperties(path){

  //if disable display is undefined then use the disableEdit
  var disableProperty = path.disableDisplay !== undefined ? 'disableDisplay' : 'disableEdit';

  if(path && path[disableProperty]){
    return true;
  }

  //TODO configure this from excluded properties
  return ['__v', '_id', 'author', 'comment', 'dateCreated'].indexOf(path.path) !== -1;
}

