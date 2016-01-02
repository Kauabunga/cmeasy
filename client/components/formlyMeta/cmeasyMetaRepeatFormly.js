(function(angular){

  'use strict';

  angular.module('cmeasyApp')
    .config(function (formlyConfigProvider) {

      return formlyConfigProvider.setType({

        name: 'cmeasyMetaRepeat',
        templateUrl: 'components/formlyMeta/formlyTemplates/cmeasyMetaRepeat.html',
        defaultOptions: {},
        controller: ['$scope', '$log', '$timeout', '$http', '$q', controller]
      });

      /**
       *
       */
      function controller($scope, $log, $timeout, $http, $q){

        const DEFINITION_KEY = 'definitionKey';

        return init();

        /**
         *
         */
        function init(){

          $scope.addField = addField;

          $scope.metaFields = getDefinitionAsArray($scope.model.definition);
          $scope.cmeasyMeta = getCmeasyMetaFormlyDefinition();

          //Watch all definitionKey items and update the definition based on changes
          $scope.$watch(getMetaFieldsDefinitionKeys, watchMetaFieldsDefinitionKeys, true);

          //Handle history selections / what ever else the item directive throws this way
          $scope.$watch('model', function(model){ $scope.metaFields = getDefinitionAsArray(model.definition); });

        }

        /**
         *
         */
        function addField($event){
          $scope.metaFields.push({});
        }

        /**
         *
         * @returns {Array|*}
         */
        function getMetaFieldsDefinitionKeys(){
          return _($scope.metaFields).map((item) => {
            return item && item[DEFINITION_KEY];
          }).filter().value();
        }

        /**
         *
         * @returns {Array|*}
         */
        function watchMetaFieldsDefinitionKeys(newKeys, prevKeys){
          $scope.model.definition = getDefinitionAsObject($scope.metaFields);
        }

        /**
         *
         * @param definition
         */
        function getDefinitionAsArray(definition){
          return _(definition).map(function (value, key) {
            return _.merge(value, {[DEFINITION_KEY]: key});
          }).filter(isDefinitionIncluded).value();
        }

        /**
         *
         * @param definition
         * @returns {*|boolean}
         */
        function isDefinitionIncluded(definition){
          return definition && ! definition.disableSchemaEdit;
        }

        /**
         *
         */
        function getCmeasyMetaFormlyDefinition(){
          return [ { type: 'cmeasyMeta' } ];
        }

        /**
         *
         * @param definition
         */
        function getDefinitionAsObject(definition){

          if(definition.length === 0){
            return {};
          }
          if(definition.length === 1){
            if(definition[0] && definition[0][DEFINITION_KEY]){
              return {[definition[0][DEFINITION_KEY]]: definition[0]};
            }
            else {
              return {};
            }
          }
          else {
            return _(definition).reduce((result, value, index) => {

              if(index === 1 && result && getDefinitionKeyFromObject(result)){
                result = getDefinitionFromObject(result);
              }
              else {
                result = {};
              }

              if(value && getDefinitionKeyFromObject(value)){
                return _.merge(result, getDefinitionFromObject(value));
              }
              else {
                return result;
              }

            });
          }
        }

        /**
         * Ensure the definition key is in camel case
         *
         * @param value
         * @returns {*}
         */
        function getDefinitionFromObject(value){

          return {[getDefinitionKeyFromObject(value)]: _.omit(value, 'definitionKey')};

        }

        /**
         *
         * @param value
         * @returns {*}
         */
        function getDefinitionKeyFromObject(value){
          return value[DEFINITION_KEY] && _.camelCase(value[DEFINITION_KEY]);
        }

      }

    });


})(angular);
