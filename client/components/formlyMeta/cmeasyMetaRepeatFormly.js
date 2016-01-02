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

              if(index === 1 && result && result[DEFINITION_KEY]){
                result = {[result[DEFINITION_KEY]]: result};
              }
              else {
                result = {};
              }

              if(value && value[DEFINITION_KEY]){
                return _.merge(result, {[value[DEFINITION_KEY]]: value});
              }
              else {
                return result;
              }

            });
          }
        }

      }

    });


})(angular);
