
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _cmeasyFlattenService = require('./cmeasy.flatten.service');

var _cmeasyFlattenService2 = _interopRequireDefault(_cmeasyFlattenService);

/**
 *
 */

exports['default'] = function (id, schemaController) {

  return {
    createModelFormlyFields: createModelFormlyFields(id, schemaController),
    createModelColumns: createModelColumns(id, schemaController)
  };
};

/**
 *
 * @param model
 */
function createModelColumns(id, schemaController) {
  return function () {
    return schemaController.show(id).then(getSchemaDefinition).then(_cmeasyFlattenService2['default']).then(function (modelSchema) {
      return (0, _lodash2['default'])(modelSchema).map(shouldDisplayColumn).filter().value();
    });
  };
}

/**
 *
 * @param model
 */
function createModelFormlyFields(id, schemaController) {
  return function () {
    return schemaController.show(id).then(getSchemaDefinition).then(_cmeasyFlattenService2['default']).then(function (modelSchema) {
      return (0, _lodash2['default'])(modelSchema).map(getPathField).filter().value();
    });
  };
}

/**
 *
 * @param type
 */
function getPathField(path, key) {

  if (excludedProperties(path)) {
    return undefined;
  } else {
    console.log('getPathField', path, path.type.toString().toLowerCase());
    return _lodash2['default'].merge(getDefaultField(path), getFieldTypeMap()[path.type.toString().toLowerCase()](path, key));
  }
}
/**
 *
 */
function getFieldTypeMap() {
  return {

    array: function array(path) {
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

    select: function select(path) {
      return {
        type: 'mdSelect',
        templateOptions: { selectOptions: path['enum'] }
      };
    },

    string: function string(path) {
      if (path.html) {
        return { type: 'WYSIWYG' };
      } else {
        return { type: 'mdInput' };
      }
    },

    number: function number(path) {
      //TODO
      return { type: 'mdInput' };
    },

    boolean: function boolean(path) {
      return { type: 'mdCheckbox' };
    },

    __schematype__: function __schematype__(path) {
      return { type: 'cmeasyMetaRepeat' };
    }
  };
}

/**
 *
 * @param path
 */
function getDefaultField(path) {
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
function getSchemaDefinition(schema) {
  return schema.definition;
}

/**
 *
 * @param text
 */
function convertPathToLabel(text) {
  return (0, _lodash2['default'])(text.split('.')).map(function (splitText) {
    return unCamelCase(splitText);
  }).value().join(' -> ');
}

/**
 *
 */
function unCamelCase(text) {
  // insert a space before all caps
  return text.replace(/([A-Z])/g, ' $1')
  // uppercase the first character
  .replace(/^./, function (str) {
    return str.toUpperCase();
  });
}

/**
 *
 * @param path
 * @param key
 * @returns {*}
 */
function shouldDisplayColumn(path, key) {
  return path && path.displayColumn ? key : undefined;
}

/**
 *
 * @param path
 * @returns {boolean}
 */
function excludedProperties(path) {

  //if disable display is undefined then use the disableEdit
  var disableProperty = path.disableDisplay !== undefined ? 'disableDisplay' : 'disableEdit';

  if (path && path[disableProperty]) {
    return true;
  }

  //TODO configure this from excluded properties
  return ['__v', '_id', 'author', 'comment', 'dateCreated'].indexOf(path.path) !== -1;
}
module.exports = exports['default'];
//# sourceMappingURL=cmeasy.controller.formly.js.map
