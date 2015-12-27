
'use strict';

import _ from 'lodash';
import {Promise} from 'bluebird';
import {Schema} from 'mongoose';

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
      .then(getAsMongooseSchema)
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
 * @param modelSchema
 * @returns {*}
 */
function getAsMongooseSchema(modelSchema){
  try {
    return new Schema(modelSchema).paths;
  }
  catch(err){
    console.error('error creating mongoose schema', err);
  }

}

/**
 *
 * @param model
 */
function createModelFormlyFields(id, schemaController){
  return function(){
    return schemaController.show(id)
      .then(getSchemaDefinition)
      .then(getAsMongooseSchema)
      .then(function(modelSchema){
        return _(modelSchema)
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
    return;
  }

  var field = {
    key: path.path,
    templateOptions: {
      label: path.options.label || convertPathToLabel(path.path),
      cssClass: path.options.cssClass || ''
    }
  };


  if(path.options.__schemaType__){
    field.type = 'cmeasyMeta';
  }
  else if(path.options.type === Boolean){
    field.type = 'mdCheckbox';
  }
  else if(path.options.type instanceof Array){

    if(path.options.autocomplete){
      field.templateOptions.autocompleteLabel = path.options.autocompleteLabel;
      field.templateOptions.autocompleteType = path.options.autocompleteType;
      field.templateOptions.autocompleteId = path.options.autocompleteId;
      field.templateOptions.autocompleteChip = path.options.autocompleteChip;
      field.type = 'mdChipsAutocomplete';
    }
    else if (path.options.displayLink){
      field.templateOptions.linkType = path.options.linkType;
      field.templateOptions.linkId = path.options.linkId;
      field.type = 'adminLink';
    }
    else {
      //Assume only a single depth
      field.templateOptions.fields = [];
      _.map(path.schema.paths, function(path){
        var pathField = getPathField(path);
        if(pathField){ field.templateOptions.fields.push(pathField); }
      });
      field.type = 'adminRepeat';
    }

  }
  else if(path.options.type === String && path.options.enum){
    field.type = 'mdSelect';
    field.templateOptions.selectOptions = path.options.enum;
  }
  else if(path.options.type === String && path.options.html){
    field.type = 'WYSIWYG';
  }
  else {
    field.type = 'mdInput';
  }


  return field;
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
  return path.options && path.options.displayColumn ? key : undefined;
}

/**
 *
 * @param path
 * @returns {boolean}
 */
function excludedProperties(path){

  //if disable display is undefined then use the disableEdit
  var disableProperty = path.options.disableDisplay !== undefined ? 'disableDisplay' : 'disableEdit';

  if(path.options && path.options[disableProperty]){
    return true;
  }

  //TODO configure this from excluded properties
  return ['__v', '_id', 'author', 'comment', 'dateCreated'].indexOf(path.path) !== -1;
}

