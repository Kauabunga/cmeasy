(function(angular){

  'use strict';

  angular.module('cmeasyApp')
    .config(function (formlyConfigProvider) {

      return formlyConfigProvider.setType({

        name: 'cmeasyMetaRepeat',
        templateUrl: 'components/formly-meta/formlyTemplates/cmeasyMetaRepeat.html',
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

          $scope.cmeasyMeta = getCmeasyMetaFormlyDefinition();

          $timeout(function(){
            //Watch all definitionKey items and update the definition based on changes
            $scope.$watch('metaFields', watchMetaFieldsDefinitionKeys, true);

            //Handle history selections / what ever else the item directive throws this way
            $scope.$watch('model', watchModel);
          });

        }

        /**
         *
         */
        function addField($event){
          $scope.metaFields.push({});
        }

        /**
         *
         */
        function watchModel(model){
          $log.debug('watchModel', model);
          $scope.metaFields = getDefinitionAsArray(model.definition);
        }

        /**
         *
         * @returns {Array|*}
         */
        function watchMetaFieldsDefinitionKeys(metaFields){

          $log.debug('watchMetaFieldsDefinitionKeys', metaFields);
          if(metaFields){
            $scope.model.definition = getDefinitionAsObject(metaFields);
            $log.debug('watchMetaFieldsDefinitionKeys', $scope.model.definition);
          }

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
            if(definition[0] && getDefinitionKeyFromObject(definition[0])){
              return getDefinitionKeyFromObject(definition[0]);
            }
            else {
              return {};
            }
          }
          else {
            return _(definition).reduce((result, value, index) => {

              $log.debug('getDefinitionAsObject: result, value, index', result, value, index);

              if(index === 1){
                if(result && getDefinitionKeyFromObject(result)){
                  result = getDefinitionFromObject(result);
                }
                else {
                  result = {};
                }
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
         * TODO should strip invalid characters
         */
        function getDefinitionKeyFromObject(value){
          return value[DEFINITION_KEY] && _.camelCase(value[DEFINITION_KEY]);
        }

      }

    });


})(angular);
