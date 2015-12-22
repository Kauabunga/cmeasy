
'use strict';

import _ from 'lodash';
import {Promise} from 'bluebird';

export default function(originalModel){

  return {
    createModelFormlyFields: createModelFormlyFields,
    createModelColumns: createModelColumns
  };


  /**
   *
   */
  function createModelFormlyFields(){
    return getFormlyFields(originalModel);
  }

  /**
   *
   * @returns {String}
   */
  function createModelColumns(){
    return getColumns(originalModel);
  }

}


/**
 *
 * @param model
 */
function getColumns(model){
  return _(model.definition)
    .map(function(path, key){
      return path.displayColumn ? key : undefined;
    })
  .filter()
  .value();
}

/**
 *
 * @param model
 */
function getFormlyFields(model){

  console.log(model);
  console.log(model);

  return _(model.definition)
    .map(getPathField)
    .filter()
    .value();

}

/**
 *
 * @param type
 */
function getPathField(path, key){

  if( excludedProperties(path, key) ){ return; }

  var field = {
    key: key,
    templateOptions: {
      label: path.label || convertPathToLabel(key),
      cssClass: path.cssClass || ''
    }
  };


  if(path.type === Boolean){
    field.type = 'mdCheckbox';
  }
  else if(path.type instanceof Array){

    if(path.autocomplete){
      field.templateOptions.autocompleteLabel = path.options.autocompleteLabel;
      field.templateOptions.autocompleteType = path.options.autocompleteType;
      field.templateOptions.autocompleteId = path.options.autocompleteId;
      field.templateOptions.autocompleteChip = path.options.autocompleteChip;
      field.type = 'mdChipsAutocomplete';
    }
    else if (path.displayLink){
      field.templateOptions.linkType = path.options.linkType;
      field.templateOptions.linkId = path.options.linkId;
      field.type = 'adminLink';
    }
    else {
      //Assume only a single depth
      field.templateOptions.fields = [];
      _.map(path, function(childPath, childKey){
        var pathField = getPathField(childPath, childKey);
        if(pathField){ field.templateOptions.fields.push(pathField); }
      });
      field.type = 'adminRepeat';
    }

  }
  else if(path.type === String && path.enum){
    field.type = 'mdSelect';
    field.templateOptions.selectOptions = path.enum;
  }
  else if(path.type === String && path.html){
    field.type = 'WYSIWYG';
  }
  else {
    field.type = 'mdInput';
  }


  return field;
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
 * @returns {boolean}
 */
function excludedProperties(path = {}, key = ''){

  //if disable display is undefined then use the disableEdit
  var disableProperty = path.disableDisplay !== undefined ? 'disableDisplay' : 'disableEdit';

  if(path[disableProperty]){
    return true;
  }

  //TODO configure this from excluded properties
  return ['__v', '_id', 'author', 'comment', 'dateCreated'].indexOf(key) !== -1;
}
